import 'express-async-errors';

import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { isCelebrateError } from 'celebrate';
import cookieParser from 'cookie-parser';

import errorMessages from '@constants/errorMessages';
import ServerError from '@shared/errors/ServerError';
import handleResponse from './middlewares/handleResponse';
import { authRouter, userRouter } from '@infra/http/routes';
import authentication from './middlewares/authentication';

export default class HTTPServer {
  private server: Express;

  constructor() {
    this.server = express();
  }

  private middlewares() {
    this.server.use(cookieParser(process.env.AUTH_COOKIE_SECRET));
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(handleResponse);
  }

  private routes() {
    this.server.get('/api/v1/ping', authentication, (req, res) => {
      res.formatedJson({
        message: 'pong',
        cookie: req.signedCookies['auth-data'],
      });
    });

    this.server.use('/api/v1/users', userRouter);
    this.server.use('/api/v1/auth', authRouter);
  }

  public async init() {
    this.middlewares();
    this.routes();
    this.handleErrors();
    return this.server;
  }

  private handleErrors() {
    this.server.use(
      async (
        err: Error | any,
        request: Request,
        response: Response,
        _: NextFunction,
      ) => {
        if (isCelebrateError(err)) {
          return response.status(400).formatedJson(
            {},
            {
              message: err.details.get('body')?.details[0].message,
              success: false,
            },
          );
        }

        if (err instanceof ServerError) {
          return response
            .status(err.statusCode)
            .formatedJson({}, { message: err.message, success: false });
        }

        console.log(err);

        return response.status(500).formatedJson(
          {},
          {
            message: errorMessages.INTERNAL_SERVER_ERROR,
            success: false,
          },
        );
      },
    );
  }
}
