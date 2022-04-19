import { v4 as uuid } from 'uuid';

import prisma from '@shared/database/prisma';

export default class ConfirmationTokenRepository {
  private confirmationTokenRepository = prisma.confirmationToken;

  public async create(userId: string) {
    const token = uuid();

    const confirmationToken = await this.confirmationTokenRepository.create({
      data: {
        userId,
        token,
      },
    });

    return confirmationToken;
  }

  public async findByToken(token: string) {
    const confirmationToken = await this.confirmationTokenRepository.findFirst({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });

    return confirmationToken;
  }
}
