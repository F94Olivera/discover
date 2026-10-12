import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { InvalidDestinationScreen, NavigationScreen, RouteButton } from '@/components/navigation-screen';
import { NavigationColors } from '@/constants/theme';
import { createLocationController, type LocationState } from '@/features/compass/location';
import { useDestinations } from '@/features/destinations/use-destinations';
import type { Destination } from '@/types/destination';

export default function CompassScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const { resolveDestination } = useDestinations();
  const destination = resolveDestination(params.id);
  if (!destination) return <InvalidDestinationScreen />;
  return <LocationScreen key={destination.id} destination={destination} />;
}

function LocationScreen({ destination }: { destination: Destination }) {
  const [state, setState] = useState<LocationState>({ status: 'idle' });
  const controller = useMemo(() => createLocationController({
    getPermission: Location.getForegroundPermissionsAsync,
    requestPermission: Location.requestForegroundPermissionsAsync,
    servicesEnabled: Location.hasServicesEnabledAsync,
    getPosition: () => Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
  }, setState), []);
  useFocusEffect(useCallback(() => {
    setState({ status: 'idle' });
    return () => controller.stop(false);
  }, [controller]));
  const pending = state.status === 'requesting' || state.status === 'locating';
  return (
    <NavigationScreen title={`Orientación hacia ${destination.name}`}
      notice="Ubicación bajo demanda · Brújula pendiente del paso 13"
      description="Al iniciar, solicitaremos ubicación mientras usás Expo Go para obtener tu posición y su precisión. No se guarda tu ubicación. La flecha y el rumbo del teléfono se incorporarán en el paso 13; la orientación será aproximada.">
      {pending && <><ActivityIndicator /><Text accessibilityLiveRegion="polite" style={styles.text}>
        {state.status === 'requesting' ? 'Solicitando permiso de ubicación…' : 'Obteniendo ubicación…'}
      </Text></>}
      {state.status === 'error' && <Text accessibilityRole="alert" style={styles.error}>{state.message}</Text>}
      {state.status === 'ready' && <Text accessibilityLiveRegion="polite" style={styles.text}>
        Ubicación obtenida{ '\n' }Latitud: {state.position.latitude.toFixed(6)}{ '\n' }
        Longitud: {state.position.longitude.toFixed(6)}{ '\n' }Precisión estimada: {state.position.accuracy.toFixed(1)} m
      </Text>}
      {!pending && <Pressable accessibilityRole="button" style={styles.button} onPress={() => void controller.start()}>
        <Text style={styles.buttonText}>{state.status === 'idle' ? 'Iniciar orientación' : 'Reintentar ubicación'}</Text>
      </Pressable>}
      {(pending || state.status === 'ready') && <Pressable accessibilityRole="button" style={styles.button} onPress={() => controller.stop()}>
        <Text style={styles.buttonText}>{pending ? 'Cancelar' : 'Detener orientación'}</Text>
      </Pressable>}
      <RouteButton href={{ pathname: '/destination/[id]', params: { id: destination.id } }} label="Volver a Detalles" dismissTo />
    </NavigationScreen>
  );
}
const styles = StyleSheet.create({
  text: { color: NavigationColors.text, fontSize: 17, lineHeight: 26 },
  error: { color: '#b91c1c', fontSize: 16, lineHeight: 24 },
  button: { backgroundColor: NavigationColors.primary, minHeight: 48, padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: NavigationColors.onPrimary, fontSize: 16, fontWeight: '600' },
});
