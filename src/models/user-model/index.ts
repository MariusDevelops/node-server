import { createUser } from './create-user';
import { getUserByEmail } from './get-user-by-email';
import { emailAvailable } from './email-available';

const UserModel = {
  getUserByEmail,
  createUser,
  emailAvailable,
};

export default UserModel;
