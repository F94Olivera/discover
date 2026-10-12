import { useLocalSearchParams } from 'expo-router';

import { InvalidDestinationScreen, NavigationScreen } from '@/components/navigation-screen';
import { useDestinations } from '@/features/destinations/use-destinations';

export default function CompassScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const { resolveDestination } = useDestinations();
  const destination = resolveDestination(params.id);
  if (!destination) return <InvalidDestinationScreen />;

  return (
    <NavigationScreen title={`Orientación hacia ${destination.name}`} description="La ubicación y la brújula se implementarán en los pasos 12 y 13. Esta pantalla todavía no solicita permisos ni activa sensores." />
  );
}
