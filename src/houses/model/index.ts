import { getHouse } from './get-house';
import { getHouses } from './get-houses';
import { createHouse } from './create-house';
import { updateHouse } from './update-house';
import { deleteHouse } from './delete-house';

const HousesModel = {
  getHouse,
  getHouses,

  createHouse,
  updateHouse,
  deleteHouse,
};

export default HousesModel;
