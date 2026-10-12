import type { CustomDestination } from '../../types/destination';
import type { KeyValueStorage } from '../../storage/auth-storage';

export type DestinationInput = { name: string; description: string; latitude: string; longitude: string };
export type DestinationErrors = Partial<Record<keyof DestinationInput, string>>;
export type CreateDestinationResult =
  | { status: 'success'; destinations: CustomDestination[] }
  | { status: 'invalid'; errors: DestinationErrors }
  | { status: 'error'; message: string };
export const DESTINATIONS_KEY = 'tourism.destinations.v1';

function parseCoordinate(raw: string): number {
  const normalized = raw.trim().replace(',', '.');
  // Decimal notation only: no exponent, hexadecimal, separators or partial parsing.
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized) ? Number(normalized) : NaN;
}
export function validateDestination(input: DestinationInput) {
  const errors: DestinationErrors = {};
  if (!input.name.trim()) errors.name = 'Ingresá un nombre.';
  if (!input.description.trim()) errors.description = 'Ingresá una descripción.';
  const latitude = parseCoordinate(input.latitude);
  const longitude = parseCoordinate(input.longitude);
  if (!Number.isFinite(latitude) || Math.abs(latitude) > 90) errors.latitude = 'Ingresá una latitud numérica entre −90 y 90.';
  if (!Number.isFinite(longitude) || Math.abs(longitude) > 180) errors.longitude = 'Ingresá una longitud numérica entre −180 y 180.';
  return { errors, fields: { name: input.name.trim(), description: input.description.trim(), latitude, longitude } };
}
function isCustomDestination(value: unknown): value is CustomDestination {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const d: Record<string, unknown> = Object.fromEntries(Object.entries(value));
  return typeof d.id === 'string' && /^custom-[A-Za-z0-9-]+$/.test(d.id)
    && d.source === 'custom' && typeof d.ownerId === 'string' && d.ownerId.startsWith('user-') && d.ownerId.length > 5
    && typeof d.name === 'string' && !!d.name.trim() && d.name === d.name.trim()
    && typeof d.description === 'string' && !!d.description.trim() && d.description === d.description.trim()
    && typeof d.latitude === 'number' && Number.isFinite(d.latitude) && Math.abs(d.latitude) <= 90
    && typeof d.longitude === 'number' && Number.isFinite(d.longitude) && Math.abs(d.longitude) <= 180
    && Object.keys(d).length === 7;
}
export function parseDestinations(raw: string | null): CustomDestination[] {
  if (raw === null) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || !value.every(isCustomDestination) || new Set(value.map(d => d.id)).size !== value.length) {
    throw new Error('Los destinos guardados no son válidos. Se conservaron los datos.');
  }
  return value;
}
export function createDestinationService(storage: KeyValueStorage, generateId: () => string) {
  let pending: CustomDestination | null = null;
  let pendingAttempt: string | null = null;
  let operating = false;
  return async (userId: string | null, input: DestinationInput, attemptId: string): Promise<CreateDestinationResult> => {
    if (!userId || !userId.startsWith('user-') || userId.length <= 5) return { status: 'error', message: 'Iniciá sesión para guardar un destino.' };
    if (operating) return { status: 'error', message: 'Esperá a que termine el guardado.' };
    const { errors, fields } = validateDestination(input);
    if (Object.keys(errors).length) return { status: 'invalid', errors };
    operating = true;
    try {
      const destinations = parseDestinations(await storage.getItem(DESTINATIONS_KEY));
      // Each mounted form has its own attempt ID. Retry reuses the destination
      // ID even after commit; opening a new form always creates a new entity.
      const retry = pending?.ownerId === userId && pendingAttempt === attemptId;
      const id = retry && pending ? pending.id : `custom-${generateId()}` as const;
      const existingIndex = destinations.findIndex(d => d.id === id);
      if (existingIndex >= 0 && !retry) throw new Error('ID collision');
      pending = { ...fields, id, ownerId: userId, source: 'custom' };
      pendingAttempt = attemptId;
      const next = [...destinations];
      if (existingIndex >= 0) next[existingIndex] = pending;
      else next.push(pending);
      await storage.setItem(DESTINATIONS_KEY, JSON.stringify(next));
      pending = null;
      return { status: 'success', destinations: next };
    } catch {
      return { status: 'error', message: 'No pudimos confirmar el guardado. Conservamos los campos. Reintentá; si ya se guardó, recuperaremos ese destino sin duplicarlo.' };
    } finally { operating = false; }
  };
}
