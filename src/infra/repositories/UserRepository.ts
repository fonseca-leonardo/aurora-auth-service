import prisma from '@shared/database/prisma';
import ICreateUserDTO from '@dtos/ICreateUserDTO';

export default class UserRepository {
  private userRepository = prisma.user;

  public async findByEmail(email: string) {
    const user = await this.userRepository.findFirst({
      where: {
        email,
      },
    });
    return user;
  }

  public async create({ email, name, profile }: ICreateUserDTO) {
    const user = await this.userRepository.create({
      data: {
        email,
        name,
        profile,
      },
    });

    return user;
  }

  public async confirmPassword(userId: string, password: string) {
    const user = await this.userRepository.update({
      where: {
        id: userId,
      },
      data: {
        password,
        emailVerified: true,
      },
    });

    return user;
  }
}
