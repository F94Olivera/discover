import { Link, Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteButton } from '@/components/navigation-screen';
import { NavigationColors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useDestinations } from '@/features/destinations/use-destinations';

export default function PlacesScreen() {
  const { user, signOut } = useAuth();
  const { destinations } = useDestinations();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);
  async function logout() {
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError(null);
    try {
      const result = await signOut();
      if (result.status === 'error') setError(result.message);
    } catch { setError('No pudimos cerrar la sesión. Reintentá.'); }
    finally { submitting.current = false; setPending(false); }
  }
  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerRight: () => (
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: pending, busy: pending }} disabled={pending}
          onPress={() => void logout()} style={{ minHeight: 48, justifyContent: 'center', paddingHorizontal: 8 }}>
          <Text style={{ color: NavigationColors.primary }}>{pending ? 'Cerrando…' : 'Cerrar sesión'}</Text>
        </Pressable>
      ) }} />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={destinations}
        keyExtractor={destination => destination.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text accessibilityRole="header" style={styles.title}>{user ? `Hola, ${user.name}` : 'Lugares de Buenos Aires'}</Text>
            <Text style={styles.description}>{destinations.length} lugares para descubrir en Buenos Aires.</Text>
            <Text style={styles.description}>Catálogo disponible sin conexión una vez cargada la aplicación.</Text>
            <RouteButton href="/destination/form" label="Agregar destino" />
            {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Link href={{ pathname: '/destination/[id]', params: { id: item.id } }} asChild>
              <Pressable style={styles.rowContent} accessibilityRole="button" accessibilityLabel={`Ver detalles de ${item.name}`}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.origin}>{item.source === 'seed' ? 'Catálogo predefinido' : 'Destino propio'}</Text>
              </Pressable>
            </Link>
            <View style={styles.favoriteSpace} accessible={false} />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.description}>No hay destinos disponibles.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: NavigationColors.background },
  list: { flex: 1 },
  listContent: { padding: 24, gap: 12, width: '100%', maxWidth: 600, alignSelf: 'center', flexGrow: 1 },
  header: { gap: 12, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: NavigationColors.text },
  description: { fontSize: 16, lineHeight: 24, color: NavigationColors.secondary },
  error: { color: '#A12E28', fontSize: 16, lineHeight: 24 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: NavigationColors.surface, padding: 16, borderRadius: 12, minHeight: 80 },
  rowContent: { flex: 1, gap: 6, minHeight: 48, justifyContent: 'center' },
  name: { fontSize: 18, lineHeight: 26, fontWeight: '600', color: NavigationColors.text },
  origin: { fontSize: 14, lineHeight: 21, color: NavigationColors.secondary },
  favoriteSpace: { width: 48, minHeight: 48 },
});
