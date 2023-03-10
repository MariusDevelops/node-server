import jwt from 'jsonwebtoken';
import config from 'config';

type HashedData = {
  email: UserEntity['email'],
  role: UserEntity['role'],
  iat: number,
};

const create = (data: HashedData) => jwt.sign(data, config.secret.jwtTokenKey);

const decode = (token: string) => jwt.decode(token) as (HashedData | null);

const TokenSevice = {
  create,
  decode,
};

export default TokenSevice;
