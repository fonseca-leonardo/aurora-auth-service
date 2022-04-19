import { Request, Response } from 'express';

import successMessages from '@constants/successMessages';
import ForgotPasswordService from '@services/ForgotPasswordService';
import UserAuthenticateService from '@services/UserAuthenticateService';

export default class AuthenticationController {
  public async store(request: Request, response: Response) {
    const { email, password } = request.body;

    const userAuthenticate = new UserAuthenticateService();

    const { data, token } = await userAuthenticate.execute({
      email,
      password,
    });

    response.cookie('auth-token', token, {
      signed: true,
      domain: process.env.COOKIE_DOMAIN,
    });

    return response.formatedJson(data, { token });
  }

  public async forgotPassword(request: Request, response: Response) {
    const { email } = request.body;

    const forgotPassword = new ForgotPasswordService();

    await forgotPassword.execute({ email });

    return response.formatedJson(
      {},
      { message: successMessages.FORGOT_PASSWORD_SENT },
    );
  }
}
