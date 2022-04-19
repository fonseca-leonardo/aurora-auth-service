import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const softDeleteEntities: any[] = [];

prisma.$use(async (params, next) => {
  const isDeletable = !!softDeleteEntities.find(el => params.model === el);

  if (isDeletable) {
    if (
      params.action === 'findMany' ||
      params.action === 'findFirst' ||
      params.action === 'count' ||
      params.action === 'aggregate'
    ) {
      params.args = {
        ...params.args,
        where: {
          deleted: false,
          ...params.args['where'],
        },
      };
    }

    if (params.action === 'delete') {
      params.action = 'update';

      params.args['data'] = { deleted: true };
    }

    if (params.action === 'deleteMany') {
      params.action = 'updateMany';

      if (params.args.data !== undefined) {
        params.args.data['deleted'] = true;
      } else {
        params.args['data'] = { deleted: true };
      }
    }
  }

  return next(params);
});

export default prisma;
