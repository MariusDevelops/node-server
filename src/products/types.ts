import { RowDataPacket } from 'mysql2';

type PrivateViewProductModel = {
  id: number,
  title: string,
  details: {
    material: string,
    sizes: string
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

export type ProductViewModel = PrivateViewProductModel & RowDataPacket;

export type ProductData = Omit<PrivateViewProductModel, 'id' | 'owner'> & {
  ownerId: number,
};

export type ProductBody = Omit<ProductData, 'ownerId'>;

export type PartialProductBody = Partial<ProductBody>;
