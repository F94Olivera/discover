import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { RouteButton, NavigationScreen } from '@/components/navigation-screen';
import { NavigationColors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import type { SigninErrors, SigninInput } from '@/types/auth';

const emptyInput: SigninInput = { email: '', password: '' };
const fields: { key: keyof SigninInput; label: string; secure?: boolean }[] = [
  { key: 'email', label: 'Correo electrónico' },
  { key: 'password', label: 'Contraseña', secure: true },
];

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [input, setInput] = useState(emptyInput);
  const [errors, setErrors] = useState<SigninErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
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
      const result = await signIn(input);
      if (!mounted.current) return;
      if (result.status === 'success') {
        setInput(emptyInput);
        // The protected Stack opens Places after persistence succeeds.
      } else if (result.status === 'invalid') {
        setErrors(result.errors);
        setMessage('Revisá los campos indicados.');
      } else {
        setMessage(result.message);
      }
    } catch {
      if (mounted.current) setMessage('No pudimos iniciar sesión. Conservamos los campos para reintentar.');
    } finally {
      submitting.current = false;
      if (mounted.current) setPending(false);
    }
  }
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <NavigationScreen title="Turismo en Buenos Aires" notice="Demostración educativa · Usá datos ficticios"
        description="Ingresá con una cuenta creada en esta instalación. Usá credenciales ficticias.">
        {fields.map(field => (
          <View key={field.key} style={styles.field}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput accessibilityLabel={field.label} value={input[field.key]} secureTextEntry={field.secure}
              autoCapitalize="none" autoCorrect={false}
              keyboardType={field.key === 'email' ? 'email-address' : 'default'}
              autoComplete="off" editable={!pending}
              onChangeText={value => setInput(previous => ({ ...previous, [field.key]: value }))}
              style={[styles.input, errors[field.key] && styles.invalidInput]} />
            {errors[field.key] && <Text style={styles.error}>{errors[field.key]}</Text>}
          </View>
        ))}
        {message && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>{message}</Text>}
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: pending, busy: pending }} disabled={pending}
          onPress={() => void submit()} style={[styles.button, pending && styles.pending]}>
          {pending && <ActivityIndicator color={NavigationColors.onPrimary} />}
          <Text style={styles.buttonText}>{pending ? 'Ingresando…' : 'Iniciar sesión'}</Text>
        </Pressable>
        {!pending && <RouteButton href="/signup" label="Ir a Registro" />}
      </NavigationScreen>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  field: { gap: 8 },
  label: { fontSize: 16, color: NavigationColors.text, fontWeight: '600' },
  input: { minHeight: 48, borderWidth: 1, borderColor: NavigationColors.secondary, borderRadius: 10, padding: 12, fontSize: 17, color: NavigationColors.text, backgroundColor: '#FFFFFF' },
  invalidInput: { borderColor: '#A12E28' },
  error: { color: '#A12E28', fontSize: 15, lineHeight: 23 },
  button: { minHeight: 48, backgroundColor: NavigationColors.primary, padding: 16, borderRadius: 12, alignItems: 'center', gap: 8 },
  buttonText: { color: NavigationColors.onPrimary, fontWeight: '600', fontSize: 16, textAlign: 'center' },
  pending: { opacity: 0.7 },
});
