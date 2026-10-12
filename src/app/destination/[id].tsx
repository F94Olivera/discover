import { useRef, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { FavoriteButton } from '@/components/favorite-button';
import { router, useLocalSearchParams } from 'expo-router';

import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { InvalidDestinationScreen, NavigationScreen, RouteButton } from '@/components/navigation-screen';
import { NavigationColors } from '@/constants/theme';
import { useDestinations } from '@/features/destinations/use-destinations';

export default function DestinationDetailsScreen() {
  const { deleteDestination } = useAuth();
  const deleting = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmDelete = (id: string, name: string) => {
    if (deleting.current) return;
    Alert.alert('Eliminar destino', `¿Querés eliminar «${name}»? También se quitará de favoritos.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => {
        if (deleting.current) return;
        deleting.current = true; setPending(true); setError(null);
        void (async () => {
          try {
            const result = await deleteDestination(id);
            if (result.status === 'success') router.dismissTo('/places');
            else setError(result.message);
          } catch { setError('No pudimos confirmar la eliminación. Reintentá.'); }
          finally { deleting.current = false; setPending(false); }
        })();
      } },
    ]);
  };
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
      {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      {destination.source === 'custom' && <Pressable accessibilityRole="button" accessibilityLabel={`Eliminar ${destination.name}`}
        accessibilityState={{ disabled: pending, busy: pending }} disabled={pending}
        style={styles.deleteButton} onPress={() => confirmDelete(destination.id, destination.name)}>
        {pending ? <ActivityIndicator color={NavigationColors.onPrimary} /> : <Text style={styles.deleteText}>Eliminar destino</Text>}
      </Pressable>}
      <FavoriteButton destinationId={destination.id} name={destination.name} showLabel />
      <Text style={styles.explanation}>La orientación estará disponible en los pasos 12 y 13.</Text>
      {destination.source === 'custom' && <RouteButton href={{ pathname: '/destination/form', params: { id: destination.id } }} label="Editar destino" />}
      <RouteButton href={{ pathname: '/compass/[id]', params: { id: destination.id } }} label="Ver pantalla de Brújula (en desarrollo)" />
      <RouteButton href="/places" label="Volver a Lugares" dismissTo />
    </NavigationScreen>
  );
}

const styles = StyleSheet.create({
  error: { color: '#b91c1c', fontSize: 16 },
  deleteButton: { backgroundColor: '#b91c1c', minHeight: 48, padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  deleteText: { color: NavigationColors.onPrimary, fontSize: 16, fontWeight: '600' },
  coordinates: { backgroundColor: NavigationColors.surface, padding: 16, borderRadius: 12, gap: 8 },
  coordinate: { color: NavigationColors.text, fontSize: 17, lineHeight: 26 },
  explanation: { color: NavigationColors.secondary, fontSize: 16, lineHeight: 24 },
});
