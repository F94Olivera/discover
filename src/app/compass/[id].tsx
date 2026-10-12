import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { ActivityIndicator, AppState, Pressable, StyleSheet, Text, View } from 'react-native';

import { InvalidDestinationScreen, NavigationScreen, RouteButton } from '@/components/navigation-screen';
import { NavigationColors } from '@/constants/theme';
import { createCompassController, type CompassState } from '@/features/compass/heading';
import { calculateBearing, calculateRelativeAngle } from '@/features/compass/orientation';
import { useDestinations } from '@/features/destinations/use-destinations';
import type { Destination } from '@/types/destination';

export default function CompassScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const { resolveDestination } = useDestinations();
  const destination = resolveDestination(params.id);
  if (!destination) return <InvalidDestinationScreen />;
  return <OrientationScreen key={destination.id} destination={destination} />;
}

function OrientationScreen({ destination }: { destination: Destination }) {
  const [state, setState] = useState<CompassState>({ status: 'idle' });
  const controller = useMemo(() => createCompassController({
    getPermission: Location.getForegroundPermissionsAsync,
    requestPermission: Location.requestForegroundPermissionsAsync,
    servicesEnabled: Location.hasServicesEnabledAsync,
    getPosition: () => Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
    watchHeading: (receive, error) => Location.watchHeadingAsync(receive, error),
    watchPosition: (receive, error) => Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 0, timeInterval: 1000 },
      ({ coords }) => receive({ latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy ?? NaN }), error),
  }, setState), []);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', next => {
      // iOS permission dialogs can temporarily make the app inactive.
      if (next === 'background') controller.stop();
    });
    return () => { subscription.remove(); controller.stop(false); };
  }, [controller]);
  useFocusEffect(useCallback(() => {
    setState({ status: 'idle' });
    return () => controller.stop(false);
  }, [controller]));
  const pending = state.status === 'requesting' || state.status === 'locating';
  const bearing = state.status === 'active' ? calculateBearing(state.position, destination, state.position.accuracy) : null;
  const angle = state.status === 'active' && state.heading !== null && bearing !== null
    ? calculateRelativeAngle(bearing, state.heading) : null;
  return (
    <NavigationScreen title={`Orientación hacia ${destination.name}`}
      notice="Brújula · Orientación aproximada"
      description="Al iniciar, usaremos ubicación y brújula mientras estás en esta pantalla. Sostené el teléfono plano, con su parte superior hacia adelante. Alejá imanes; en interiores puede ser poco fiable. No se guarda tu ubicación. Es una orientación aproximada, sin rutas viales ni precisión UWB.">
      {pending && <><ActivityIndicator /><Text accessibilityLiveRegion="polite" style={styles.text}>
        {state.status === 'requesting' ? 'Solicitando permiso de ubicación…' : 'Obteniendo ubicación…'}
      </Text></>}
      {state.status === 'error' && <Text accessibilityRole="alert" style={styles.error}>{state.message}</Text>}
      {state.status === 'active' && <Text accessibilityLiveRegion="polite" style={styles.text}>
        Ubicación obtenida{ '\n' }Latitud: {state.position.latitude.toFixed(6)}{ '\n' }
        Longitud: {state.position.longitude.toFixed(6)}{ '\n' }Precisión estimada: {state.position.accuracy.toFixed(1)} m
      </Text>}
      {state.status === 'active' && <>
        <Text style={styles.text}>{state.message}</Text>
        {bearing === null && <Text style={styles.text}>Estás dentro del margen de precisión de ubicación del destino o no hay un rumbo único. No podemos indicar una dirección fiable.</Text>}
        {angle !== null && <View accessible accessibilityRole="image"
          accessibilityLabel={`Dirección aproximada hacia ${destination.name}: ${Math.abs(angle).toFixed(0)} grados ${angle >= 0 ? 'a la derecha' : 'a la izquierda'} respecto del teléfono.`}
          style={styles.arrowContainer}>
          <Text accessible={false} style={[styles.arrow, { transform: [{ rotate: `${angle}deg` }] }]}>↑</Text>
        </View>}
        {angle !== null && <Text style={styles.text}>Giro aproximado: {angle.toFixed(0)}° · Rumbo al destino: {bearing?.toFixed(0)}°</Text>}
      </>}
      {!pending && state.status !== 'active' && <Pressable accessibilityRole="button" style={styles.button} onPress={() => void controller.start()}>
        <Text style={styles.buttonText}>{state.status === 'idle' ? 'Iniciar orientación' : 'Reintentar orientación'}</Text>
      </Pressable>}
      {(pending || state.status === 'active') && <Pressable accessibilityRole="button" style={styles.button} onPress={() => controller.stop()}>
        <Text style={styles.buttonText}>{pending ? 'Cancelar' : 'Detener orientación'}</Text>
      </Pressable>}
      <RouteButton href={{ pathname: '/destination/[id]', params: { id: destination.id } }} label="Volver a Detalles" dismissTo />
    </NavigationScreen>
  );
}
const styles = StyleSheet.create({
  arrowContainer: { alignItems: 'center', justifyContent: 'center', minHeight: 180 },
  arrow: { color: NavigationColors.primary, fontSize: 110, lineHeight: 150 },
  text: { color: NavigationColors.text, fontSize: 17, lineHeight: 26 },
  error: { color: '#b91c1c', fontSize: 16, lineHeight: 24 },
  button: { backgroundColor: NavigationColors.primary, minHeight: 48, padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: NavigationColors.onPrimary, fontSize: 16, fontWeight: '600' },
});
