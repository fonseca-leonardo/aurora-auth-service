import errorMessages from '@constants/errorMessages';
import AdopterProfileRepository from '@infra/repositories/AdopterProfileRepository';
import OngProfileRepository from '@infra/repositories/OngProfileRepository';
import UserRepository from '@infra/repositories/UserRepository';
import HashProvider from '@shared/container/providers/HashProvider';
import JwtProvider from '@shared/container/providers/JwtProvider';
import ServerError from '@shared/errors/ServerError';

interface IRequest {
  email: string;
  password: string;
}

export default class UserAuthenticateService {
  private hashProvider = new HashProvider();
  private userRepository = new UserRepository();
  private ongProfileRepository = new OngProfileRepository();
  private adopterProfileRepository = new AdopterProfileRepository();

  private jwtProvider = new JwtProvider();

  public async execute({ email, password }: IRequest) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ServerError(errorMessages.INVALID_CREDENTIALS);
    }

    const passwordMatched = await this.hashProvider.compare(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new ServerError(errorMessages.INVALID_CREDENTIALS);
    }

    if (!user.emailVerified) {
      throw new ServerError(errorMessages.USER_NOT_VERIFIED);
    }

    const ongProfile = await this.ongProfileRepository.findByUserId(user.id);
    const adopterProfile = await this.adopterProfileRepository.findByUserId(
      user.id,
    );

    const token = this.jwtProvider.sign<AuthTokenData>(
      {
        data: {
          userId: user.id,
          ...(ongProfile && { organizationId: ongProfile.ongId }),
        },
      },
      process.env.JWT_SECRET,
      {
        expireIn: process.env.JWT_EXPIRES_IN,
      },
    );

    return {
      data: {
        user: {
          name: user.name,
        },
        ...(ongProfile && { ongProfile }),
        ...(adopterProfile && { adopterProfile }),
      },
      token,
    };
  }
}
