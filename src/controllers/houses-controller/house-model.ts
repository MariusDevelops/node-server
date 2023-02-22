type HouseModel = {
  id: string,
  title: string,
  location: {
    country: string,
    city: string
  },
  images: string[],
  price: number,
  rating: number
};

export default HouseModel;
