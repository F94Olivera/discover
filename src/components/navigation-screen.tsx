import { Link, router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavigationColors, Spacing } from '@/constants/theme';

type NavigationScreenProps = { title: string; description: string; children?: ReactNode; notice?: string };

export function NavigationScreen({ title, description, children, notice = 'Pantalla en desarrollo · Navegación de prueba' }: NavigationScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.notice}>{notice}</Text>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.actions}>{children}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type RouteButtonProps = { href: Href; label: string; replace?: boolean; dismissTo?: boolean };

export function RouteButton({ href, label, replace = false, dismissTo = false }: RouteButtonProps) {
  return (
    <Link href={href} replace={replace} dismissTo={dismissTo} asChild>
      <Pressable accessibilityRole="button" style={styles.button}>
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>
    </Link>
  );
}

export function BackButton({ fallback, label }: { fallback: Href; label: string }) {
  return (
    <Pressable accessibilityRole="button" onPress={() => router.canGoBack() ? router.back() : router.replace(fallback)}
      style={styles.button}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function InvalidDestinationScreen() {
  return (
    <NavigationScreen title="Destino no disponible" description="Este destino no existe o no está disponible para tu cuenta." notice="No pudimos abrir el destino">
      <RouteButton href="/places" label="Volver a Lugares" dismissTo />
    </NavigationScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: NavigationColors.background },
  scrollContent: { flexGrow: 1, padding: Spacing.four, alignItems: 'center' },
  content: { width: '100%', maxWidth: 600, gap: Spacing.four },
  notice: { backgroundColor: NavigationColors.surface, color: NavigationColors.secondary, padding: Spacing.three, borderRadius: 12, fontSize: 14, lineHeight: 21 },
  title: { color: NavigationColors.text, fontSize: 28, fontWeight: '700' },
  description: { color: NavigationColors.secondary, fontSize: 17, lineHeight: 26 },
  actions: { gap: Spacing.three },
  button: { backgroundColor: NavigationColors.primary, minHeight: 48, padding: Spacing.three, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: NavigationColors.onPrimary, fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
