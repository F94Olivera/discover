import type { AuthStorage } from '../../storage/auth-storage';
import type { SigninInput, SigninResult, SignoutResult } from '../../types/auth';
import type { PasswordTools } from './registration';
import { normalizeEmail, validateSignin } from './validation';

export async function restoreSession(storage: AuthStorage) {
  const users = await storage.readUsers();
  const session = await storage.readSession(users);
  const user = users.find(candidate => candidate.id === session?.userId) ?? null;
  // An orphaned session is ignored, preserving storage for explicit recovery.
  return { user, session };
}

export function createSessionService(storage: AuthStorage, passwords: PasswordTools) {
  let busy = false;
  return {
    async signIn(input: SigninInput): Promise<SigninResult> {
      if (busy) return { status: 'error', message: 'Esperá a que termine la operación en curso.' };
      const errors = validateSignin(input);
      if (Object.keys(errors).length) return { status: 'invalid', errors };
      busy = true;
      try {
        const users = await storage.readUsers();
        await storage.readSession(users);
        const user = users.find(candidate => candidate.email === normalizeEmail(input.email));
        if (!user || await passwords.hash(input.password, user.passwordSalt) !== user.passwordVerifier) {
          return { status: 'error', message: 'Correo o contraseña incorrectos.' };
        }
        const session = { userId: user.id };
        await storage.saveSession(session);
        return { status: 'success', user, session };
      } catch {
        return { status: 'error', message: 'No pudimos leer los datos o guardar la sesión. Los datos se conservan. Reintentá.' };
      } finally { busy = false; }
    },
    async signOut(): Promise<SignoutResult> {
      if (busy) return { status: 'error', message: 'Esperá a que termine la operación en curso.' };
      busy = true;
      try {
        await storage.clearSession();
        return { status: 'success' };
      } catch {
        return { status: 'error', message: 'No pudimos confirmar el cierre de sesión. Reintentá.' };
      } finally { busy = false; }
    },
  };
}
