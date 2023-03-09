type UserViewModel = {
  id: number,
  email: string,
  name: string,
  surname: string,
  role: 'ADMIN' | 'USER',
};

export type Credentials = {
  email: string,
  password: string,
};

export type CredentialPartial = Partial<Credentials>;

export type AuthSuccessResponse = {
  token: string,
  user: UserViewModel
};