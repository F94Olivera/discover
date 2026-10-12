import type { KeyValueStorage } from '../../storage/auth-storage';
import type { CustomDestination, Destination } from '../../types/destination';
import { selectVisibleDestination } from '../destinations/selectors';

export type Favorite = { userId: string; destinationId: string };
export const FAVORITES_KEY = 'tourism.favorites.v1';
export type FavoriteResult = { status: 'success'; favorites: Favorite[] } | { status: 'error'; message: string };

// Invalid references block hydration rather than silently discarding saved data.
export function parseFavorites(raw: string | null, userIds: readonly string[], destinations: readonly CustomDestination[]): Favorite[] {
  if (raw === null) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value)) throw new Error('Favoritos inválidos.');
  const favorites: Favorite[] = [];
  const pairs = new Set<string>();
  for (const entry of value) {
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)
      || Object.keys(entry).length !== 2 || !('userId' in entry) || !('destinationId' in entry)
      || typeof entry.userId !== 'string' || typeof entry.destinationId !== 'string'
      || !userIds.includes(entry.userId) || !selectVisibleDestination(entry.userId, destinations, entry.destinationId)) {
      throw new Error('Favoritos inválidos.');
    }
    const pair = JSON.stringify([entry.userId, entry.destinationId]);
    if (pairs.has(pair)) throw new Error('Favoritos duplicados.');
    pairs.add(pair);
    favorites.push({ userId: entry.userId, destinationId: entry.destinationId });
  }
  return favorites;
}

export function sortFavoriteDestinations(destinations: readonly Destination[], favorites: readonly Favorite[], userId: string | null): readonly Destination[] {
  const ids = new Set(favorites.filter(favorite => favorite.userId === userId).map(favorite => favorite.destinationId));
  return [...destinations.filter(destination => ids.has(destination.id)), ...destinations.filter(destination => !ids.has(destination.id))];
}

// Use the requested final state, derived from confirmed UI state. Retrying a
// rejected write that actually reached storage cannot accidentally toggle back.
export function createFavoriteService(storage: KeyValueStorage) {
  let operating = false;
  return async (userId: string | null, destinationId: string, selected: boolean, userIds: readonly string[], destinations: readonly CustomDestination[]): Promise<FavoriteResult> => {
    if (operating) return { status: 'error', message: 'Esperá a que termine el guardado.' };
    operating = true;
    try {
      if (!userId || !userIds.includes(userId) || !selectVisibleDestination(userId, destinations, destinationId)) {
        return { status: 'error', message: 'No podés modificar los favoritos de este destino.' };
      }
      const favorites = parseFavorites(await storage.getItem(FAVORITES_KEY), userIds, destinations);
      const next = favorites.filter(favorite => favorite.userId !== userId || favorite.destinationId !== destinationId);
      if (selected) next.push({ userId, destinationId });
      await storage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return { status: 'success', favorites: next };
    } catch {
      return { status: 'error', message: 'No pudimos confirmar el favorito. Conservamos el estado anterior; reintentá.' };
    } finally { operating = false; }
  };
}
