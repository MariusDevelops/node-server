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
  rating: number,
  owner: {
    id: number,
    name: string,
    surname: string,
    email: string,
    mobile: string,
  }
};

export type HouseViewModel = PrivateViewHouseModel & RowDataPacket;

export type HouseData = Omit<PrivateViewHouseModel, 'id' | 'owner'> & {
  ownerId: number,
};

export type HouseBody = Omit<HouseData, 'ownerId'>;

export type PartialHouseBody = Partial<HouseBody>;
