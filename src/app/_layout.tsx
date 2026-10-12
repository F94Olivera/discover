import { Stack } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { StatusBar } from 'expo-status-bar';

import { NavigationColors } from '@/constants/theme';

export default function RootLayout() {
  return <AuthProvider><RootNavigation /></AuthProvider>;
}

function RootNavigation() {
  const { loading, error, retryLoad, session } = useAuth();
  if (loading || error) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {loading ? <><ActivityIndicator color={NavigationColors.primary} /><Text style={styles.text}>Leyendo datos locales…</Text></> : <>
          <Text accessibilityRole="alert" style={styles.text}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={retryLoad} style={styles.button}><Text style={styles.buttonText}>Reintentar lectura</Text></Pressable>
        </>}
      </View>
    </SafeAreaView>
  );
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: NavigationColors.background },
        headerTintColor: NavigationColors.text,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: NavigationColors.background },
      }}>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="index" options={{ title: 'Iniciar sesión' }} />
          <Stack.Screen name="signup" options={{ title: 'Registro' }} />
        </Stack.Protected>
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="places" options={{ title: 'Lugares' }} />
          <Stack.Screen name="destination/[id]" options={{ title: 'Detalles' }} />
          <Stack.Screen name="destination/form" options={{ title: 'Agregar destino' }} />
          <Stack.Screen name="compass/[id]" options={{ title: 'Brújula' }} />
        </Stack.Protected>
        <Stack.Screen name="+not-found" options={{ title: 'Pantalla no encontrada' }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NavigationColors.background, justifyContent: 'center', padding: 24 },
  content: { gap: 20 },
  text: { color: NavigationColors.text, fontSize: 17, lineHeight: 26 },
  button: { backgroundColor: NavigationColors.primary, padding: 16, borderRadius: 12, minHeight: 48 },
  buttonText: { color: NavigationColors.onPrimary, textAlign: 'center', fontSize: 16 },
});
