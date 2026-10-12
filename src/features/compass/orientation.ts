export type GeographicPosition = Readonly<{
  latitude: number;
  longitude: number;
}>;

const EARTH_RADIUS_METERS = 6_371_000;
const MINIMUM_DISTANCE_METERS = 1;

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function validatePosition(position: GeographicPosition): void {
  if (!Number.isFinite(position.latitude) || Math.abs(position.latitude) > 90 ||
      !Number.isFinite(position.longitude) || Math.abs(position.longitude) > 180) {
    throw new RangeError('Las coordenadas deben ser finitas y estar dentro de los rangos geográficos.');
  }
}

/** Degrees in [0, 360); accepts equivalent positive and negative rotations. */
export function normalizeDegrees(degrees: number): number {
  if (!Number.isFinite(degrees)) {
    throw new RangeError('El ángulo debe ser finito.');
  }
  return ((degrees % 360) + 360) % 360;
}

/**
 * Initial great-circle bearing, clockwise from TRUE north, in degrees [0, 360).
 * Inputs are degrees; trigonometry uses radians internally.
 * null means no useful direction: within max(1 m, position accuracy), or an
 * antipodal pair with no unique shortest route. Accuracy is a nonnegative radius
 * in meters, not a claim that GPS can resolve a direction at that distance.
 */
export function calculateBearing(
  origin: GeographicPosition,
  destination: GeographicPosition,
  positionAccuracyMeters = 0,
): number | null {
  validatePosition(origin);
  validatePosition(destination);
  if (!Number.isFinite(positionAccuracyMeters) || positionAccuracyMeters < 0) {
    throw new RangeError('La precisión de posición debe ser finita y no negativa.');
  }

  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);
  const latitudeDifference = destinationLatitude - originLatitude;
  const longitudeDifference = toRadians(destination.longitude - origin.longitude);
  const haversine = Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(originLatitude) * Math.cos(destinationLatitude) *
    Math.sin(longitudeDifference / 2) ** 2;
  // Clamp rounding at coincident/antipodal points before taking square roots.
  const clampedHaversine = Math.min(1, Math.max(0, haversine));
  const distance = EARTH_RADIUS_METERS * 2 * Math.atan2(
    Math.sqrt(clampedHaversine), Math.sqrt(1 - clampedHaversine),
  );
  if (distance <= Math.max(MINIMUM_DISTANCE_METERS, positionAccuracyMeters)) {
    return null;
  }

  const east = Math.sin(longitudeDifference) * Math.cos(destinationLatitude);
  const north = Math.cos(originLatitude) * Math.sin(destinationLatitude) -
    Math.sin(originLatitude) * Math.cos(destinationLatitude) * Math.cos(longitudeDifference);
  if (Math.hypot(east, north) < 1e-12) {
    return null;
  }
  return normalizeDegrees(Math.atan2(east, north) * 180 / Math.PI);
}

/**
 * Arrow rotation in degrees [-180, 180): 0 forward, positive clockwise/right,
 * negative counterclockwise/left; -180 points behind. Use TRUE heading only,
 * in [0, 360). A magnetic heading cannot be substituted without a declination
 * correction. Invalid/unavailable sensor sentinels (e.g. -1) are rejected.
 * Sensor quality/availability must also be checked by the future sensor layer.
 */
export function calculateRelativeAngle(bearing: number, trueHeading: number): number {
  if (!Number.isFinite(trueHeading) || trueHeading < 0 || trueHeading >= 360) {
    throw new RangeError('El rumbo del dispositivo respecto del norte verdadero debe estar entre 0 y menos de 360 grados.');
  }
  return normalizeDegrees(normalizeDegrees(bearing) - trueHeading + 180) - 180;
}
