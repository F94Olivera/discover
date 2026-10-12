import type { SeedDestination } from '../types/destination';

// PLACES.md defines the stable IDs, coordinates and base order. Bundled, never persisted.
export const defaultDestinations: readonly SeedDestination[] = Object.freeze([
  Object.freeze({ id: 'seed-01', name: "Obelisco", description: "Monumento emblemático de Buenos Aires.", latitude: -34.603889, longitude: -58.381667, source: 'seed' as const }),
  Object.freeze({ id: 'seed-02', name: "Teatro Colón", description: "Teatro de Buenos Aires dedicado a las artes escénicas.", latitude: -34.601111, longitude: -58.383056, source: 'seed' as const }),
  Object.freeze({ id: 'seed-03', name: "Floralis Genérica", description: "Escultura con forma de flor.", latitude: -34.583056, longitude: -58.393333, source: 'seed' as const }),
  Object.freeze({ id: 'seed-04', name: "Torre Monumental (Torre de los Ingleses)", description: "Torre monumental de Buenos Aires.", latitude: -34.593056, longitude: -58.373056, source: 'seed' as const }),
  Object.freeze({ id: 'seed-05', name: "Monumento de los Españoles", description: "Monumento de la ciudad de Buenos Aires.", latitude: -34.575000, longitude: -58.415278, source: 'seed' as const }),
  Object.freeze({ id: 'seed-06', name: "Plaza de Mayo", description: "Plaza emblemática de Buenos Aires.", latitude: -34.608333, longitude: -58.371944, source: 'seed' as const }),
  Object.freeze({ id: 'seed-07', name: "Pirámide de Mayo", description: "Monumento situado en Plaza de Mayo.", latitude: -34.608889, longitude: -58.372222, source: 'seed' as const }),
  Object.freeze({ id: 'seed-08', name: "Casa Rosada", description: "Edificio de gobierno frente a Plaza de Mayo.", latitude: -34.608056, longitude: -58.370278, source: 'seed' as const }),
  Object.freeze({ id: 'seed-09', name: "Cabildo de Buenos Aires", description: "Edificio histórico de Buenos Aires.", latitude: -34.608889, longitude: -58.373889, source: 'seed' as const }),
  Object.freeze({ id: 'seed-10', name: "Catedral Metropolitana", description: "Catedral de la ciudad de Buenos Aires.", latitude: -34.607500, longitude: -58.373333, source: 'seed' as const }),
  Object.freeze({ id: 'seed-11', name: "Palacio del Congreso de la Nación Argentina", description: "Palacio sede del Congreso de la Nación.", latitude: -34.610000, longitude: -58.392778, source: 'seed' as const }),
  Object.freeze({ id: 'seed-12', name: "Palacio Barolo", description: "Palacio de Buenos Aires.", latitude: -34.609444, longitude: -58.385833, source: 'seed' as const }),
  Object.freeze({ id: 'seed-13', name: "Café Tortoni", description: "Café emblemático de Buenos Aires.", latitude: -34.608889, longitude: -58.378333, source: 'seed' as const }),
  Object.freeze({ id: 'seed-14', name: "Palacio de Aguas Corrientes", description: "Edificio conocido como Palacio de Aguas Corrientes.", latitude: -34.600556, longitude: -58.395000, source: 'seed' as const }),
  Object.freeze({ id: 'seed-15', name: "Cementerio de la Recoleta", description: "Cementerio situado en Recoleta.", latitude: -34.588056, longitude: -58.393056, source: 'seed' as const }),
  Object.freeze({ id: 'seed-16', name: "Basílica de Nuestra Señora del Pilar", description: "Basílica situada en Recoleta.", latitude: -34.586667, longitude: -58.391944, source: 'seed' as const }),
  Object.freeze({ id: 'seed-17', name: "Monumento al General San Martín y a los Ejércitos de la Independencia", description: "Monumento dedicado a San Martín y los Ejércitos de la Independencia.", latitude: -34.595000, longitude: -58.377222, source: 'seed' as const }),
  Object.freeze({ id: 'seed-18', name: "Manzana de las Luces", description: "Conjunto histórico y cultural de Buenos Aires.", latitude: -34.610556, longitude: -58.374444, source: 'seed' as const }),
  Object.freeze({ id: 'seed-19', name: "Buque Museo Fragata Presidente Sarmiento", description: "Buque museo de Buenos Aires.", latitude: -34.608944, longitude: -58.365667, source: 'seed' as const }),
  Object.freeze({ id: 'seed-20', name: "Puente de la Mujer", description: "Puente peatonal de Buenos Aires.", latitude: -34.608056, longitude: -58.365000, source: 'seed' as const }),
]);
