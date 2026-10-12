import type { AuthStorage } from '../../storage/auth-storage';
import type { SignupInput, SignupResult, User } from '../../types/auth';
import { normalizeEmail, validateSignup } from './validation';

export type PasswordTools = {
  createId: () => string;
  createSalt: () => Promise<string>;
  hash: (password: string, salt: string) => Promise<string>;
};

// One service per provider serializes writes and keeps only a verifier for retry.
export function createRegistrationService(storage: AuthStorage, passwords: PasswordTools) {
  let busy = false;
  let pendingUser: User | null = null;
  let pendingAccountSaved = false;
  return async function signUp(input: SignupInput): Promise<SignupResult> {
    if (busy) return { status: 'error', message: 'Esperá a que termine el registro en curso.' };
    const errors = validateSignup(input);
    if (Object.keys(errors).length) return { status: 'invalid', errors };
    busy = true;
    let accountSaved = pendingAccountSaved && pendingUser?.email === normalizeEmail(input.email);
    try {
      const users = await storage.readUsers();
      // Validate session before any write; malformed data is never silently overwritten.
      await storage.readSession(users);
      const email = normalizeEmail(input.email);
      const existing = users.find(user => user.email === email);
      if (existing) {
        if (pendingUser?.id !== existing.id) {
          return { status: 'invalid', errors: { email: 'Ya existe una cuenta con este correo.' } };
        }
        if (await passwords.hash(input.password, existing.passwordSalt) !== existing.passwordVerifier) {
          return { status: 'invalid', errors: { password: 'Usá la contraseña de la cuenta que acabás de crear para reintentar.' } };
        }
        accountSaved = true;
        pendingAccountSaved = true;
        pendingUser = existing;
      } else {
        pendingAccountSaved = false;
        const salt = await passwords.createSalt();
        pendingUser = {
          id: passwords.createId(), name: input.name.trim(), email,
          passwordSalt: salt, passwordVerifier: await passwords.hash(input.password, salt),
        };
        // Keep pendingUser before writing: a rejected write might still have committed.
        await storage.saveUsers([...users, pendingUser]);
        accountSaved = true;
        pendingAccountSaved = true;
      }
      const user = pendingUser;
      const session = { userId: user.id };
      await storage.saveSession(session);
      pendingUser = null;
      pendingAccountSaved = false;
      return { status: 'success', user, session };
    } catch {
      return accountSaved
        ? { status: 'account-saved', message: 'Tu cuenta se guardó, pero no pudimos guardar la sesión. Reintentá con el mismo correo y contraseña para entrar sin crear otra cuenta.' }
        : { status: 'error', message: 'No pudimos confirmar el registro. Revisá los datos guardados o reintentá. No se borró ninguna cuenta.' };
    } finally {
      busy = false;
    }
  };
}
