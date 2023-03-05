import { RowDataPacket } from 'mysql2';

type PrivateViewHouseModel = {
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

export type HouseViewModel = PrivateViewHouseModel & RowDataPacket;

export type HouseData = Omit<PrivateViewHouseModel, 'id'>;

export type PartialHouseData = Partial<HouseData>;
