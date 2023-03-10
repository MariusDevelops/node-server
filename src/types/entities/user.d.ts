type UserEntity = {
  id: number,
  email: string,
  name: string,
  surname: string,
  password: string,
  role: 'ADMIN' | 'USER',
};
