export const ROOMS = [
  'Living room',
  'Dining room',
  'Bedroom',
  'Kitchen',
  'Home office',
  'Office',
  'Bathroom',
  'Staircase and hallway',
] as const;

export type Room = (typeof ROOMS)[number];

export interface Product {
  id: string;
  name: string;
  category: string;
  rooms: Room[];
  price: number;
  description?: string;
  imageUrl?: string;
}
