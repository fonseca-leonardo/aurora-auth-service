import prisma from '@shared/database/prisma';
import IAdopterProfileDTO from '@dtos/IAdopterProfileDTO';

export default class AdopterProfileRepository {
  private adopterRepository = prisma.adopterProfile;

  public async create({
    userId,
    city,
    extra,
    neighborhood,
    state,
    street,
    streetNumber,
    zipCode,
  }: IAdopterProfileDTO) {
    const profile = await this.adopterRepository.create({
      data: {
        userId,
        city,
        extra,
        neighborhood,
        state,
        street,
        streetNumber,
        zipCode,
      },
    });

    return profile;
  }

  public async findByUserId(userId: string) {
    const profile = await this.adopterRepository.findFirst({
      where: {
        userId,
      },
    });

    return profile;
  }
}
