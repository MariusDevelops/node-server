import { RowDataPacket } from 'mysql2';

type PrivateHouseModel = {
  id: number,
  title: string,
  location: {
    country: string,
    city: string
  },
  images: string[],
  price: number,
  rating: number
};

export type HouseModel = PrivateHouseModel & RowDataPacket;

export type HouseData = Omit<PrivateHouseModel, 'id'>;

export type PartialHouseData = Partial<HouseData>;
