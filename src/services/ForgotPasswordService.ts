import errorMessages from '@constants/errorMessages';
import ServerError from '@shared/errors/ServerError';
import UserRepository from '@infra/repositories/UserRepository';
import queueProvider from '@shared/container/providers/QueueProvider';
import ConfirmationTokenRepository from '@infra/repositories/ConfirmationTokenRepository';

interface IRequest {
  email: string;
}

export default class ForgotPasswordService {
  private userRepository = new UserRepository();
  private confirmationTokenRepository = new ConfirmationTokenRepository();

  public async execute({ email }: IRequest) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new ServerError(errorMessages.EMAIL_NOT_FOUND);
    }

    const confirmationToken = await this.confirmationTokenRepository.create(
      user.id,
    );

    const message = {
      to: {
        email: email,
        name: user.name,
      },
      subject: 'Recuperar sua senha - Aurora',
      emailFile: 'forgot-password',
      variables: {
        name: user.name,
        activationLink: `${process.env.FRONT_URL}/esqueci-minha-senha/${confirmationToken.token}`,
      },
    };
    queueProvider.producer('send-email', {
      value: JSON.stringify(message),
    });
  }
}
