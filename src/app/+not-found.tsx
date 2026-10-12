import { NavigationScreen, RouteButton } from '@/components/navigation-screen';

export default function NotFoundScreen() {
  return (
    <NavigationScreen title="Pantalla no encontrada" description="El enlace no corresponde a una pantalla disponible.">
      <RouteButton href="/" label="Volver a Login" replace />
    </NavigationScreen>
  );
}
