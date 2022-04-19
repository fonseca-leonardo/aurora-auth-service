import { NextFunction, Request, Response } from 'express';

export default (request: Request, response: Response, next: NextFunction) => {
  response.formatedJson = async (
    data: any,
    { success = true, token, message = '' }: FormatedJsonOptions = {},
  ) => {
    return response.json({ data, success, token, message });
  };

  return next();
};
