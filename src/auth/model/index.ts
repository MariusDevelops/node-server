import { createUser } from './create-user';
import { getUser } from './get-user';
import { emailAvailable } from './email-available';

const UserModel = {
  getUser,
  createUser,
  emailAvailable,
};

export default UserModel;
