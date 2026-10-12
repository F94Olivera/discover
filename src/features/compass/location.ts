export type Position = { latitude: number; longitude: number; accuracy: number };
export type LocationState =
  | { status: 'idle' | 'requesting' | 'locating' }
  | { status: 'ready'; position: Position }
  | { status: 'error'; message: string; settings: boolean };
export type LocationAdapter = {
  getPermission: () => Promise<{ granted: boolean; canAskAgain: boolean }>;
  requestPermission: () => Promise<{ granted: boolean; canAskAgain: boolean }>;
  servicesEnabled: () => Promise<boolean>;
  getPosition: () => Promise<{ coords: { latitude: number; longitude: number; accuracy: number | null } }>;
};

/** No native calls until start. Cancellation invalidates every pending result.
 * Native one-shot promises cannot be aborted; timeout/stop ignore their results.
 * No listeners are created. The timer is released on completion/stop/departure.
 */
export function createLocationController(adapter: LocationAdapter, publish: (state: LocationState) => void, timeoutMs = 20_000) {
  let generation = 0;
  let running = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const clearTimer = () => { clearTimeout(timer); timer = undefined; };
  const stop = (notify = true) => {
    generation++; running = false; clearTimer();
    if (notify) publish({ status: 'idle' });
  };
  const start = async () => {
    if (running) return;
    running = true;
    const attempt = ++generation;
    const current = () => attempt === generation;
    const fail = (message: string, settings = false) => {
      if (!current()) return;
      generation++; running = false; clearTimer();
      publish({ status: 'error', message, settings });
    };
    publish({ status: 'requesting' });
    try {
      let permission = await adapter.getPermission();
      if (!current()) return;
      if (!permission.granted && permission.canAskAgain) {
        permission = await adapter.requestPermission();
        if (!current()) return;
      }
      if (!permission.granted) {
        fail(permission.canAskAgain
          ? 'Necesitamos permiso de ubicación para orientarte. Podés reintentar.'
          : 'El permiso está bloqueado. En Ajustes, habilitá ubicación mientras se usa Expo Go y luego reintentá.', !permission.canAskAgain);
        return;
      }
      publish({ status: 'locating' });
      timer = setTimeout(() => fail('La ubicación tardó demasiado. Buscá un lugar abierto y reintentá.'), timeoutMs);
      if (!await adapter.servicesEnabled()) {
        fail('Los servicios de ubicación están desactivados. Activá Localización en los ajustes del dispositivo y reintentá.', true);
        return;
      }
      if (!current()) return;
      const { coords } = await adapter.getPosition();
      if (!current()) return;
      if (!Number.isFinite(coords.latitude) || Math.abs(coords.latitude) > 90 ||
          !Number.isFinite(coords.longitude) || Math.abs(coords.longitude) > 180 ||
          coords.accuracy === null || !Number.isFinite(coords.accuracy) || coords.accuracy < 0) {
        fail('La ubicación o su precisión no son válidas. Reintentá.'); return;
      }
      clearTimer(); running = false;
      publish({ status: 'ready', position: { latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy } });
    } catch {
      fail('No pudimos obtener la ubicación. Revisá el permiso y la señal, y reintentá.');
    }
  };
  return { start, stop };
}
