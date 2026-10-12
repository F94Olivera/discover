import { createLocationController, type LocationAdapter, type LocationState, type Position } from './location';

export type Heading = { trueHeading: number; accuracy: number };
type Subscription = { remove: () => void };
export type CompassAdapter = LocationAdapter & {
  watchHeading: (receive: (heading: Heading) => void, error: () => void) => Promise<Subscription>;
  watchPosition: (receive: (position: Position) => void, error: () => void) => Promise<Subscription>;
};
export type CompassState = Exclude<LocationState, { status: 'ready' }> |
  { status: 'active'; position: Position; heading: number | null; message: string };

/** Medium/high calibration only. Never mix magnetic heading with true bearing. */
export function isReliableHeading(heading: Heading): boolean {
  return Number.isFinite(heading.trueHeading) && heading.trueHeading >= 0 && heading.trueHeading < 360 &&
    (heading.accuracy === 2 || heading.accuracy === 3);
}

/** Every native subscription resolved after cancellation is immediately removed.
 * Callback tokens also reject events queued before stop or a newer start.
 */
export function createCompassController(adapter: CompassAdapter, publish: (state: CompassState) => void, timeoutMs = 20_000) {
  let generation = 0;
  let running = false;
  let subscriptions: Subscription[] = [];
  let timer: ReturnType<typeof setTimeout> | undefined;
  let position: Position | undefined;
  let heading: number | null = null;
  let message = 'Esperando rumbo del teléfono…';
  const cleanup = () => {
    clearTimeout(timer);
    timer = undefined;
    subscriptions.forEach(subscription => subscription.remove());
    subscriptions = [];
  };
  const emit = () => {
    if (position) publish({ status: 'active', position, heading, message });
  };
  const fail = (text: string) => {
    generation++; running = false; location.stop(false); cleanup();
    publish({ status: 'error', message: text, settings: false });
  };
  const subscribe = async (initial: Position, attempt: number) => {
    const current = () => running && generation === attempt;
    position = initial;
    emit();
    const armTimeout = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (current()) fail('El rumbo no está disponible o dejó de actualizarse. Probá en un teléfono físico y reintentá.');
      }, timeoutMs);
    };
    armTimeout();
    // Ownership transfers only while this attempt is current, including callbacks
    // that arrive before the promise returns the subscription handle.
    const retain = (subscription: Subscription) => {
      if (current()) subscriptions.push(subscription);
      else subscription.remove();
    };
    try {
      retain(await adapter.watchHeading(value => {
        if (!current()) return;
        armTimeout();
        heading = isReliableHeading(value) ? value.trueHeading : null;
        message = heading === null
          ? 'Rumbo no disponible o de baja calidad. Alejá imanes y fundas magnéticas, mové suavemente el teléfono para calibrar y probá al aire libre.'
          : 'Rumbo respecto del norte verdadero · orientación aproximada';
        emit();
      }, () => { if (current()) fail('No pudimos leer la brújula. Reintentá en un teléfono físico.'); }));
      if (!current()) return;
      retain(await adapter.watchPosition(value => {
        if (!current()) return;
        if (!Number.isFinite(value.latitude) || Math.abs(value.latitude) > 90 ||
            !Number.isFinite(value.longitude) || Math.abs(value.longitude) > 180 ||
            !Number.isFinite(value.accuracy) || value.accuracy < 0) {
          fail('La ubicación o su precisión no son válidas. Reintentá.'); return;
        }
        position = value;
        emit();
      }, () => { if (current()) fail('La ubicación dejó de estar disponible. Revisá Localización y reintentá.'); }));
    } catch {
      if (current()) fail('No pudimos activar los sensores. Reintentá en un teléfono físico.');
    }
  };
  const location = createLocationController(adapter, state => {
    if (!running) return;
    if (state.status === 'ready') void subscribe(state.position, generation);
    else {
      if (state.status === 'error') running = false;
      publish(state);
    }
  }, timeoutMs);
  const stop = (notify = true) => {
    generation++; running = false; location.stop(false); cleanup();
    position = undefined; heading = null; message = 'Esperando rumbo del teléfono…';
    if (notify) publish({ status: 'idle' });
  };
  const start = async () => {
    if (running) return;
    stop(false);
    running = true;
    await location.start();
  };
  return { start, stop };
}
