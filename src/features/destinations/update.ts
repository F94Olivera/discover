import type { KeyValueStorage } from '../../storage/auth-storage';
import { DESTINATIONS_KEY, parseDestinations, validateDestination, type CreateDestinationResult, type DestinationInput } from './creation';

// Replace at the same index: identity, ownership and creation order are immutable.
export function createUpdateDestinationService(storage: KeyValueStorage) {
  let operating = false;
  return async (userId: string | null, id: string, input: DestinationInput): Promise<CreateDestinationResult> => {
    if (operating) return { status: 'error', message: 'Esperá a que termine el guardado.' };
    operating = true;
    try {
      const destinations = parseDestinations(await storage.getItem(DESTINATIONS_KEY));
      const index = destinations.findIndex(destination => destination.id === id && destination.ownerId === userId);
      if (!userId || index < 0) return { status: 'error', message: 'No podés editar este destino.' };
      const { errors, fields } = validateDestination(input);
      if (Object.keys(errors).length) return { status: 'invalid', errors };
      const next = [...destinations];
      next[index] = { ...destinations[index], ...fields };
      await storage.setItem(DESTINATIONS_KEY, JSON.stringify(next));
      return { status: 'success', destinations: next };
    } catch {
      return { status: 'error', message: 'No pudimos confirmar los cambios. Conservamos los campos para reintentar.' };
    } finally { operating = false; }
  };
}
