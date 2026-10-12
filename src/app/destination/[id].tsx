import { useLocalSearchParams } from 'expo-router';

import { StyleSheet, Text, View } from 'react-native';
import { InvalidDestinationScreen, NavigationScreen, RouteButton } from '@/components/navigation-screen';
import { NavigationColors } from '@/constants/theme';
import { useDestinations } from '@/features/destinations/use-destinations';

export default function DestinationDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const { resolveDestination } = useDestinations();
  const destination = resolveDestination(params.id);
  if (!destination) return <InvalidDestinationScreen />;

  return (
    <NavigationScreen title={destination.name} description={destination.description}
      notice={destination.source === 'seed' ? 'Catálogo predefinido · Solo lectura' : 'Destino propio'}>
      <View style={styles.coordinates}>
        <Text style={styles.coordinate}>Latitud: {destination.latitude}</Text>
        <Text style={styles.coordinate}>Longitud: {destination.longitude}</Text>
      </View>
      <Text style={styles.explanation}>Los favoritos se incorporarán en el paso 9. La orientación estará disponible en los pasos 12 y 13.</Text>
      {destination.source === 'custom' && <RouteButton href={{ pathname: '/destination/form', params: { id: destination.id } }} label="Editar destino" />}
      <RouteButton href={{ pathname: '/compass/[id]', params: { id: destination.id } }} label="Ver pantalla de Brújula (en desarrollo)" />
      <RouteButton href="/places" label="Volver a Lugares" dismissTo />
    </NavigationScreen>
  );
}

const styles = StyleSheet.create({
  coordinates: { backgroundColor: NavigationColors.surface, padding: 16, borderRadius: 12, gap: 8 },
  coordinate: { color: NavigationColors.text, fontSize: 17, lineHeight: 26 },
  explanation: { color: NavigationColors.secondary, fontSize: 16, lineHeight: 24 },
});
