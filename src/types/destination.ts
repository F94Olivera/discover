type DestinationFields = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

export type SeedDestination = Readonly<DestinationFields & {
  id: `seed-${string}`;
  source: 'seed';
  ownerId?: never;
}>;

export type CustomDestination = Readonly<DestinationFields & {
  id: `custom-${string}`;
  source: 'custom';
  ownerId: string;
}>;

export type Destination = SeedDestination | CustomDestination;
