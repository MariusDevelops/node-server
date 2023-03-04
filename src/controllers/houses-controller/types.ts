import { RowDataPacket } from 'mysql2';

export interface HouseModel extends RowDataPacket {
  id: number,
  title: string,
  location: {
    country: string,
    city: string
  },
  images: string[],
  price: number,
  rating: number
}

export type HouseData = Omit<HouseModel, 'id'>;

export type PartialHouseData = Partial<HouseData>;
