import { defaultDestinations } from '../../data/defaultDestinations';
import type { CustomDestination, Destination } from '../../types/destination';

// Custom array order is creation order; updates must preserve its position.
// Anonymous users cannot browse. Filtering preserves order without mutating inputs.
export function selectVisibleDestinations(
  userId: string | null,
  customDestinations: readonly CustomDestination[],
): readonly Destination[] {
  if (!userId) return [];
  return [...defaultDestinations, ...customDestinations.filter(destination => destination.ownerId === userId)];
}

// Route parameters are external input. Arrays (even with one ID) are ambiguous.
// Resolve only within the active user's catalog; never reveal a foreign entity.
export function selectVisibleDestination(
  userId: string | null,
  customDestinations: readonly CustomDestination[],
  id: string | string[] | undefined,
): Destination | null {
  if (typeof id !== 'string' || !/^(seed|custom)-[A-Za-z0-9-]+$/.test(id)) return null;
  return selectVisibleDestinations(userId, customDestinations).find(destination => destination.id === id) ?? null;
}

// Form routes accept only visible, owned custom destinations.
export function selectEditableDestination(
  userId: string | null,
  customDestinations: readonly CustomDestination[],
  id: string | string[] | undefined,
): CustomDestination | null {
  const destination = selectVisibleDestination(userId, customDestinations, id);
  return destination?.source === 'custom' ? destination : null;
}
