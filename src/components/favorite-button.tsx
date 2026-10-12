import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/context/auth-context';
import { NavigationColors } from '@/constants/theme';

export function FavoriteButton({ destinationId, name, showLabel = false }: { destinationId: string; name: string; showLabel?: boolean }) {
  const { favorites, user, favoritePending, toggleFavorite } = useAuth();
  const selected = favorites.some(favorite => favorite.userId === user?.id && favorite.destinationId === destinationId);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function toggle() {
    if (submitting.current || favoritePending) return;
    submitting.current = true;
    setSaving(true);
    setError(null);
    try {
      const result = await toggleFavorite(destinationId);
      if (mounted.current && result.status === 'error') setError(result.message);
    } catch {
      if (mounted.current) setError('No pudimos confirmar el favorito. Reintentá.');
    } finally {
      submitting.current = false;
      if (mounted.current) setSaving(false);
    }
  }
  return <View style={showLabel ? styles.details : styles.container}>
    <Pressable accessibilityRole="button" accessibilityLabel={`${selected ? 'Quitar de' : 'Agregar a'} favoritos: ${name}`}
      accessibilityState={{ selected, disabled: favoritePending || saving, busy: saving }} disabled={favoritePending || saving}
      onPress={() => void toggle()} style={styles.button}>
      <Text style={[styles.heart, selected && styles.selected]}>{selected ? '♥' : '♡'}</Text>
      {saving && <ActivityIndicator color={NavigationColors.primary} />}
      {showLabel && <Text style={styles.label}>{saving ? 'Guardando…' : selected ? 'Quitar de favoritos' : 'Agregar a favoritos'}</Text>}
    </Pressable>
    {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
  </View>;
}
const styles = StyleSheet.create({
  container: { alignItems: 'center', maxWidth: '45%' },
  details: { gap: 8 },
  button: { minHeight: 48, minWidth: 48, padding: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 8 },
  heart: { fontSize: 32, color: NavigationColors.secondary },
  selected: { color: '#C62828' },
  label: { color: NavigationColors.text, fontSize: 16 },
  error: { color: '#A12E28', fontSize: 14, lineHeight: 21 },
});
