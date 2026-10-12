import { createDeleteDestinationService, recoverDeletion, type DeleteDestinationResult } from '@/features/destinations/deletion';
import { createFavoriteService, FAVORITES_KEY, parseFavorites, type Favorite, type FavoriteResult } from '@/features/favorites/favorites';
import { createUpdateDestinationService } from '@/features/destinations/update';
import * as Crypto from 'expo-crypto';
import { createDestinationService, DESTINATIONS_KEY, parseDestinations, type DestinationInput, type CreateDestinationResult } from '@/features/destinations/creation';
import type { CustomDestination } from '@/types/destination';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { passwordTools } from '@/features/auth/password';
import { createRegistrationService } from '@/features/auth/registration';
import { createSessionService, restoreSession } from '@/features/auth/session';
import { createAuthStorage } from '@/storage/auth-storage';
import type { Session, SigninInput, SigninResult, SignoutResult, SignupInput, SignupResult, User } from '@/types/auth';

const storage = createAuthStorage(AsyncStorage);
type AuthContextValue = {
  deleteDestination: (id: string) => Promise<DeleteDestinationResult>;
  favorites: readonly Favorite[];
  favoritePending: boolean;
  toggleFavorite: (id: string) => Promise<FavoriteResult>;
  updateDestination: (id: string, input: DestinationInput) => Promise<CreateDestinationResult>;
  customDestinations: readonly CustomDestination[];
  createDestination: (input: DestinationInput, attemptId: string) => Promise<CreateDestinationResult>;
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  retryLoad: () => void;
  signIn: (input: SigninInput) => Promise<SigninResult>;
  signOut: () => Promise<SignoutResult>;
  signUp: (input: SignupInput) => Promise<SignupResult>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const deleting = useRef(createDeleteDestinationService(AsyncStorage));
  const favoriting = useRef(createFavoriteService(AsyncStorage));
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoritePending, setFavoritePending] = useState(false);
  const registration = useRef(createRegistrationService(storage, passwordTools));
  const sessions = useRef(createSessionService(storage, passwordTools));
  const updating = useRef(createUpdateDestinationService(AsyncStorage));
  const creation = useRef(createDestinationService(AsyncStorage, Crypto.randomUUID));
  const [customDestinations, setCustomDestinations] = useState<CustomDestination[]>([]);
  const operating = useRef(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    void (async () => {
      let recovering = false;
      try {
        const restored = await restoreSession(storage);
        const users = await storage.readUsers();
        recovering = true;
        await recoverDeletion(AsyncStorage, users.map(account => account.id));
        recovering = false;
        const destinations = parseDestinations(await AsyncStorage.getItem(DESTINATIONS_KEY));
        const savedFavorites = parseFavorites(await AsyncStorage.getItem(FAVORITES_KEY), users.map(account => account.id), destinations);
        if (active) { setFavorites(savedFavorites); setCustomDestinations(destinations); setUser(restored.user); setSession(restored.session); setError(null); setLoading(false); }
      } catch {
        if (active) { setError(recovering ? 'No pudimos recuperar una eliminación pendiente. Los datos se conservan. Reintentá la lectura para completar la baja.' : 'No pudimos leer las cuentas, la sesión, los destinos o los favoritos. Los datos se conservan. Reintentá; si el problema continúa, revisá el almacenamiento.'); setLoading(false); }
      }
    })();
    return () => { active = false; };
  }, [loadAttempt]);
  const retryLoad = useCallback(() => { setLoading(true); setLoadAttempt(attempt => attempt + 1); }, []);
  const signUp = useCallback(async (input: SignupInput): Promise<SignupResult> => {
    if (loading || error) return { status: 'error', message: 'Esperá a que se puedan leer los datos guardados.' };
    if (operating.current) return { status: 'error', message: 'Esperá a que termine la operación en curso.' };
    operating.current = true;
    try {
      const result = await registration.current(input);
      if (result.status === 'success') { setUser(result.user); setSession(result.session); }
      return result;
    } finally { operating.current = false; }
  }, [loading, error]);
  const signIn = useCallback(async (input: SigninInput): Promise<SigninResult> => {
    if (loading || error || operating.current) return { status: 'error', message: 'Esperá a que se puedan leer los datos o termine la operación.' };
    operating.current = true;
    try {
      const result = await sessions.current.signIn(input);
      if (result.status === 'success') { setUser(result.user); setSession(result.session); }
      return result;
    } finally { operating.current = false; }
  }, [loading, error]);
  const signOut = useCallback(async (): Promise<SignoutResult> => {
    if (loading || error || operating.current) return { status: 'error', message: 'Esperá a que termine la operación en curso.' };
    operating.current = true;
    try {
      const result = await sessions.current.signOut();
      if (result.status === 'success') { setUser(null); setSession(null); }
      return result;
    } finally { operating.current = false; }
  }, [loading, error]);
  const createDestination = useCallback(async (input: DestinationInput, attemptId: string): Promise<CreateDestinationResult> => {
    if (loading || error || operating.current) return { status: 'error', message: 'Esperá a que se puedan leer los datos o termine la operación.' };
    operating.current = true;
    try {
      const result = await creation.current(session?.userId ?? null, input, attemptId);
      if (result.status === 'success') setCustomDestinations(result.destinations);
      return result;
    } finally { operating.current = false; }
  }, [loading, error, session]);
  const updateDestination = useCallback(async (id: string, input: DestinationInput): Promise<CreateDestinationResult> => {
    if (loading || error || operating.current) return { status: 'error', message: 'Esperá a que se puedan leer los datos o termine la operación.' };
    operating.current = true;
    try {
      const result = await updating.current(session?.userId ?? null, id, input);
      if (result.status === 'success') setCustomDestinations(result.destinations);
      return result;
    } finally { operating.current = false; }
  }, [loading, error, session]);
  const deleteDestination = useCallback(async (id: string): Promise<DeleteDestinationResult> => {
    if (loading || error || operating.current) return { status: 'error', message: 'Esperá a que se puedan leer los datos o termine la operación.', recoveryRequired: false };
    operating.current = true;
    try {
      const users = await storage.readUsers();
      const result = await deleting.current(session?.userId ?? null, id, users.map(account => account.id));
      if (result.status === 'success') { setCustomDestinations(result.destinations); setFavorites(result.favorites); }
      else if (result.recoveryRequired) setError(result.message);
      return result;
    } catch {
      return { status: 'error', message: 'No pudimos leer las cuentas. Reintentá.', recoveryRequired: false };
    } finally { operating.current = false; }
  }, [loading, error, session]);
  const toggleFavorite = useCallback(async (id: string): Promise<FavoriteResult> => {
    if (loading || error || operating.current) return { status: 'error', message: 'Esperá a que se puedan leer los datos o termine la operación.' };
    operating.current = true;
    setFavoritePending(true);
    try {
      const users = await storage.readUsers();
      const selected = !favorites.some(favorite => favorite.userId === session?.userId && favorite.destinationId === id);
      const result = await favoriting.current(session?.userId ?? null, id, selected, users.map(account => account.id), customDestinations);
      if (result.status === 'success') setFavorites(result.favorites);
      return result;
    } catch {
      return { status: 'error', message: 'No pudimos leer los favoritos. Reintentá.' };
    } finally { operating.current = false; setFavoritePending(false); }
  }, [loading, error, session, favorites, customDestinations]);
  return <AuthContext.Provider value={{ deleteDestination, favorites, favoritePending, toggleFavorite, updateDestination, customDestinations, createDestination, user, session, loading, error, retryLoad, signUp, signIn, signOut }}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider is required.');
  return context;
}
