import { verify, sign } from 'jsonwebtoken';

import ITokenConfig from './models/ITokenConfig';
import ITokenData from './models/ITokenData';

export default class JwtProvider {
  sign<T>(data: ITokenData<T>, secret: string, config: ITokenConfig): string {
    return sign(data, secret, { expiresIn: config.expireIn });
  }

  authorize<T>(token: string, secret: string): ITokenData<T> | undefined {
    try {
      const decoded = verify(token, secret) as ITokenData<T>;

      return decoded;
    } catch (error) {}
  }
}
