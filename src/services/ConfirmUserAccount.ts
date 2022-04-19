import { addDays, isBefore } from 'date-fns';

import UserRepository from '@infra/repositories/UserRepository';
import ConfirmationTokenRepository from '@infra/repositories/ConfirmationTokenRepository';
import ServerError from '@shared/errors/ServerError';
import errorMessages from '@constants/errorMessages';
import HashProvider from '@shared/container/providers/HashProvider';

interface IRequest {
  activationToken: string;
  password: string;
}

export default class ConfirmUserAccountService {
  private userRepository = new UserRepository();
  private confirmationTokenRepository = new ConfirmationTokenRepository();
  private hashProvider = new HashProvider();

  public async execute({ activationToken, password }: IRequest) {
    const confirmationToken =
      await this.confirmationTokenRepository.findByToken(activationToken);

    if (!confirmationToken) {
      throw new ServerError(errorMessages.CONFIRMATION_LINK_EXPIRED, 400);
    }

    if (!confirmationToken.userId) {
      throw new ServerError(errorMessages.CONFIRMATION_LINK_EXPIRED, 400);
    }

    const expiredDate = addDays(confirmationToken.createdAt, 2);

    const isExpired = isBefore(expiredDate, new Date());

    if (isExpired) {
      throw new ServerError(errorMessages.CONFIRMATION_LINK_EXPIRED, 400);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    await this.userRepository.confirmPassword(
      confirmationToken.userId,
      hashedPassword,
    );
  }
}
