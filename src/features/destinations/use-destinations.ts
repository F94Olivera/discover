import { sortFavoriteDestinations } from '@/features/favorites/favorites';
import { useAuth } from '@/context/auth-context';
import { selectEditableDestination, selectVisibleDestination, selectVisibleDestinations } from '@/features/destinations/selectors';
export function useDestinations() {
  const { user, customDestinations, favorites } = useAuth();
  const userId = user?.id ?? null;
  return {
    resolveEditableDestination: (id: string | string[] | undefined) => selectEditableDestination(userId, customDestinations, id),
    destinations: sortFavoriteDestinations(selectVisibleDestinations(userId, customDestinations), favorites, userId),
    resolveDestination: (id: string | string[] | undefined) => selectVisibleDestination(userId, customDestinations, id),
  };
}
