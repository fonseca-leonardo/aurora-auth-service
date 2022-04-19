import prisma from '@shared/database/prisma';
import ICreateOngProfileDTO from '@dtos/ICreateOngProfileDTO';

export default class OngProfileRepository {
  private ongProfileRepository = prisma.ongProfile;

  public async create({ userId, ongId, phone }: ICreateOngProfileDTO) {
    const ongProfile = await this.ongProfileRepository.create({
      data: {
        userId,
        ongId,
        phone,
      },
    });

    return ongProfile;
  }

  public async findByUserId(userId: string) {
    const ongProfile = await this.ongProfileRepository.findFirst({
      where: {
        userId,
      },
    });

    return ongProfile;
  }
}
