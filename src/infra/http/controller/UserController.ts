import { Request, Response } from 'express';
import CreateUserService from '@services/CreateUserService';
import ConfirmUserAccountService from '@services/ConfirmUserAccount';
import successMessages from '@constants/successMessages';

export default class UserController {
  public async store(request: Request, response: Response) {
    const {
      email,
      name,
      profile,
      state,
      city,
      extra,
      neighborhood,
      ongId,
      phone,
      street,
      streetNumber,
      zipCode,
    } = request.body;

    const createUser = new CreateUserService();

    await createUser.execute({
      email,
      name,
      profile,
      state,
      city,
      extra,
      neighborhood,
      ongId,
      phone,
      street,
      streetNumber,
      zipCode,
    });

    return response
      .status(200)
      .formatedJson({}, { message: successMessages.USER_CREATED });
  }

  public async confirmPassword(request: Request, response: Response) {
    const { activationToken, password } = request.body;

    const confirmUser = new ConfirmUserAccountService();

    await confirmUser.execute({ activationToken, password });

    return response
      .status(200)
      .formatedJson({}, { message: successMessages.USER_CONFIRMED });
  }
}
