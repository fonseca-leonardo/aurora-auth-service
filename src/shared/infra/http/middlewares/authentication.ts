import { NextFunction, Request, Response } from 'express';

import ErrorMessages from '@constants/errorMessages';
import ServerError from '@shared/errors/ServerError';
import JwtProvider from '@shared/container/providers/JwtProvider';

export default (request: Request, response: Response, next: NextFunction) => {
  const authProvider = new JwtProvider();
  const cookies = request.signedCookies;

  if (!cookies) {
    throw new ServerError(ErrorMessages.NOT_ALLOWED, 401);
  }

  const authorization = cookies['auth-token'];

  if (!authorization) {
    throw new ServerError(ErrorMessages.NOT_ALLOWED, 401);
  }

  const token = authorization;

  const decoded = authProvider.authorize<AuthTokenData>(
    token,
    process.env.JWT_SECRET || '',
  );

  if (!decoded) {
    throw new ServerError(ErrorMessages.NOT_ALLOWED, 401);
  }

  const { data } = decoded;

  request.authData = data;

  return next();
};
