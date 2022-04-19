import queueProvider from '@shared/container/providers/QueueProvider';
import errorMessages from '@constants/errorMessages';
import AdopterProfileRepository from '@infra/repositories/AdopterProfileRepository';
import OngProfileRepository from '@infra/repositories/OngProfileRepository';
import UserRepository from '@infra/repositories/UserRepository';
import ServerError from '@shared/errors/ServerError';
import ConfirmationTokenRepository from '@infra/repositories/ConfirmationTokenRepository';
import ProfileEnum from '@constants/ProfileEnum';

interface IRequest {
  email: string;
  name: string;
  profile: Profile;
  street?: string;
  streetNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  extra?: string;
  ongId?: string;
  phone?: string;
}

export default class CreateUserService {
  private userRepository = new UserRepository();
  private ongProfileRepository = new OngProfileRepository();
  private adopterProfileRepository = new AdopterProfileRepository();
  private confirmationTokenRepository = new ConfirmationTokenRepository();

  public async execute({
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
  }: IRequest) {
    const userCreated = await this.userRepository.findByEmail(email);

    if (userCreated) {
      throw new ServerError(errorMessages.EMAIL_ALREADY_IN_USE, 400);
    }

    const user = await this.userRepository.create({
      email,
      name,
      profile,
    });

    if (profile === ProfileEnum.ONG) {
      await this.ongProfileRepository.create({
        userId: user.id,
        ongId,
        phone,
      });
    }

    if (profile === ProfileEnum.ADOPTER) {
      await this.adopterProfileRepository.create({
        userId: user.id,
        state,
        city,
        extra,
        neighborhood,
        phone,
        street,
        streetNumber,
        zipCode,
      });
    }

    const confirmationToken = await this.confirmationTokenRepository.create(
      user.id,
    );

    const message = {
      to: {
        email: email,
        name: name,
      },
      subject: 'Confirmação de cadastro',
      emailFile: 'confirmation-email',
      variables: {
        name,
        activationLink: `${process.env.FRONT_URL}/confirmar/${confirmationToken.token}`,
      },
    };

    await queueProvider.producer('send-email', {
      value: JSON.stringify(message),
    });
  }
}
