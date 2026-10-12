import type { KeyValueStorage } from '../../storage/auth-storage';
import type { CustomDestination } from '../../types/destination';
import { FAVORITES_KEY, parseFavorites, type Favorite } from '../favorites/favorites';
import { DESTINATIONS_KEY, parseDestinations } from './creation';

export const DELETION_KEY = 'tourism.deletion.v1';
export type DeleteDestinationResult =
  | { status: 'success'; destinations: CustomDestination[]; favorites: Favorite[] }
  | { status: 'error'; message: string; recoveryRequired: boolean };

// Write-ahead journal: once saved, recovery always finishes the same logical
// deletion. No other mutations are allowed until both keys and cleanup succeed.
export async function recoverDeletion(storage: KeyValueStorage, userIds: readonly string[]): Promise<void> {
  const raw = await storage.getItem(DELETION_KEY);
  if (raw === null) return;
  const value: unknown = JSON.parse(raw);
  if (typeof value !== 'object' || value === null || Array.isArray(value)
    || Object.keys(value).length !== 2 || !('destinations' in value) || !('favorites' in value)) {
    throw new Error('Invalid deletion journal');
  }
  const destinations = parseDestinations(JSON.stringify(value.destinations));
  if (destinations.some(destination => !userIds.includes(destination.ownerId))) throw new Error('Invalid owner');
  const favorites = parseFavorites(JSON.stringify(value.favorites), userIds, destinations);
  await storage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  await storage.setItem(DESTINATIONS_KEY, JSON.stringify(destinations));
  await storage.removeItem(DELETION_KEY);
}

export function createDeleteDestinationService(storage: KeyValueStorage) {
  let operating = false;
  return async (userId: string | null, id: string, userIds: readonly string[]): Promise<DeleteDestinationResult> => {
    if (operating) return { status: 'error', message: 'Esperá a que termine la eliminación.', recoveryRequired: false };
    operating = true;
    let recoveryRequired = false;
    try {
      if (await storage.getItem(DELETION_KEY) !== null) {
        return { status: 'error', message: 'Hay una eliminación pendiente. Reintentá la lectura para completarla.', recoveryRequired: true };
      }
      const destinations = parseDestinations(await storage.getItem(DESTINATIONS_KEY));
      if (!userId || !userIds.includes(userId) || !destinations.some(destination => destination.id === id && destination.ownerId === userId)) {
        return { status: 'error', message: 'No podés eliminar este destino.', recoveryRequired: false };
      }
      const favorites = parseFavorites(await storage.getItem(FAVORITES_KEY), userIds, destinations);
      const next = { destinations: destinations.filter(destination => destination.id !== id), favorites: favorites.filter(favorite => favorite.destinationId !== id) };
      // A rejected promise may still have persisted the journal: block mutations
      // even when this first write fails, until a validated reload resolves it.
      recoveryRequired = true;
      await storage.setItem(DELETION_KEY, JSON.stringify(next));
      await recoverDeletion(storage, userIds);
      return { status: 'success', ...next };
    } catch {
      return { status: 'error', message: recoveryRequired
        ? 'No pudimos confirmar la eliminación. Reintentá la lectura para completar o comprobar la baja pendiente.'
        : 'No pudimos eliminar el destino. Los datos se conservan; reintentá.', recoveryRequired };
    } finally { operating = false; }
  };
}
