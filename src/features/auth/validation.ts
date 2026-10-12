import type { SigninErrors, SigninInput, SignupErrors, SignupInput } from '../../types/auth';

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
export function isEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export function validateSignup(input: SignupInput): SignupErrors {
  const errors: SignupErrors = {};
  if (!input.name.trim()) errors.name = 'Ingresá tu nombre.';
  if (!isEmail(normalizeEmail(input.email))) errors.email = 'Ingresá un correo válido.';
  if (input.password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres.';
  if (!input.confirmation || input.password !== input.confirmation) errors.confirmation = 'Las contraseñas deben coincidir.';
  return errors;
}

export function validateSignin(input: SigninInput): SigninErrors {
  const errors: SigninErrors = {};
  if (!normalizeEmail(input.email)) errors.email = 'Ingresá tu correo.';
  if (!input.password) errors.password = 'Ingresá tu contraseña.';
  return errors;
}
