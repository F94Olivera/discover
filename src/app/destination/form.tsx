import type { CustomDestination } from '@/types/destination';
import { useDestinations } from '@/features/destinations/use-destinations';
import * as Crypto from 'expo-crypto';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { InvalidDestinationScreen, NavigationScreen } from '@/components/navigation-screen';
import { NavigationColors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import type { DestinationErrors, DestinationInput } from '@/features/destinations/creation';

const emptyInput: DestinationInput = { name: '', description: '', latitude: '', longitude: '' };
const fields: { key: keyof DestinationInput; label: string; coordinate?: boolean }[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'description', label: 'Descripción' },
  { key: 'latitude', label: 'Latitud (−90 a 90)', coordinate: true },
  { key: 'longitude', label: 'Longitud (−180 a 180)', coordinate: true },
];
export default function DestinationFormScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const { resolveEditableDestination } = useDestinations();
  const editing = params.id !== undefined;
  const editableDestination = editing ? resolveEditableDestination(params.id) : null;
  if (editing && !editableDestination) return <InvalidDestinationScreen />;
  return <DestinationForm key={editableDestination?.id ?? 'create'} editableDestination={editableDestination} />;
}
function DestinationForm({ editableDestination }: { editableDestination: CustomDestination | null }) {
  const { createDestination, updateDestination } = useAuth();
  const editing = editableDestination !== null;
  const [input, setInput] = useState<DestinationInput>(() => editableDestination ? {
    name: editableDestination.name, description: editableDestination.description,
    latitude: String(editableDestination.latitude), longitude: String(editableDestination.longitude),
  } : emptyInput);
  const [errors, setErrors] = useState<DestinationErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const attemptId = useRef(Crypto.randomUUID());
  const submitting = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function submit() {
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setErrors({});
    setMessage(null);
    try {
      const result = editableDestination ? await updateDestination(editableDestination.id, input) : await createDestination(input, attemptId.current);
      if (!mounted.current) return;
      if (result.status === 'success') router.dismissTo(editableDestination ? { pathname: '/destination/[id]', params: { id: editableDestination.id } } : '/places');
      else if (result.status === 'invalid') { setErrors(result.errors); setMessage('Revisá los campos indicados.'); }
      else setMessage(result.message);
    } catch {
      if (mounted.current) setMessage('No pudimos confirmar el guardado. Conservamos los campos para reintentar.');
    } finally {
      submitting.current = false;
      if (mounted.current) setPending(false);
    }
  }
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <Stack.Screen options={{ title: editing ? 'Editar destino' : 'Agregar destino', headerBackVisible: !pending, gestureEnabled: !pending }} />
      <NavigationScreen title={editing ? 'Editar destino propio' : 'Agregar un destino propio'} notice="Destino privado de tu cuenta"
        description="Usá punto o coma decimal, por ejemplo -34,6037, y signo menos para sur y oeste. No uses separadores de miles. Podés ingresar 0.">
        {fields.map(field => (
          <View key={field.key} style={styles.field}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput accessibilityLabel={field.label} value={input[field.key]} editable={!pending}
              keyboardType={field.coordinate && Platform.OS !== 'ios' ? 'numbers-and-punctuation' : 'default'}
              autoCapitalize={field.coordinate ? 'none' : 'sentences'} autoCorrect={!field.coordinate}
              multiline={field.key === 'description'}
              onChangeText={value => setInput(previous => ({ ...previous, [field.key]: value }))}
              style={[styles.input, field.key === 'description' && styles.descriptionInput, errors[field.key] && styles.invalidInput]} />
            {errors[field.key] && <Text accessibilityRole="alert" style={styles.error}>{errors[field.key]}</Text>}
          </View>
        ))}
        {message && <Text accessibilityRole="alert" style={styles.error}>{message}</Text>}
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: pending, busy: pending }} disabled={pending}
          onPress={() => void submit()} style={styles.button}>
          {pending && <ActivityIndicator color={NavigationColors.onPrimary} />}
          <Text style={styles.buttonText}>{pending ? 'Guardando…' : 'Guardar destino'}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: pending }} disabled={pending}
          onPress={() => router.canGoBack() ? router.back() : router.replace(editableDestination ? { pathname: '/destination/[id]', params: { id: editableDestination.id } } : '/places')} style={styles.button}>
          <Text style={styles.buttonText}>Cancelar y volver</Text>
        </Pressable>
      </NavigationScreen>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  field: { gap: 8 },
  label: { color: NavigationColors.text, fontSize: 16, fontWeight: '600' },
  input: { minHeight: 48, borderWidth: 1, borderColor: NavigationColors.secondary, borderRadius: 12, padding: 12, color: NavigationColors.text, backgroundColor: NavigationColors.surface, fontSize: 16 },
  descriptionInput: { minHeight: 96, textAlignVertical: 'top' },
  invalidInput: { borderColor: '#A12E28' },
  error: { color: '#A12E28', fontSize: 16, lineHeight: 24 },
  button: { minHeight: 48, borderRadius: 12, padding: 16, backgroundColor: NavigationColors.primary, alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { color: NavigationColors.onPrimary, fontSize: 16, fontWeight: '600' },
});
