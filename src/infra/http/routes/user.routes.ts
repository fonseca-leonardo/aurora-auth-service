import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ProfileEnum from '@constants/ProfileEnum';
import UserController from '../controller/UserController';

const router = Router();

const userController = new UserController();

router.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      profile: Joi.string()
        .valid(ProfileEnum.ADOPTER, ProfileEnum.ONG)
        .required(),
      state: Joi.string().empty(),
      city: Joi.string().empty(),
      extra: Joi.string().empty(),
      neighborhood: Joi.string().empty(),
      ongId: Joi.string().empty(),
      phone: Joi.string().empty(),
      street: Joi.string().empty(),
      streetNumber: Joi.string().empty(),
      zipCode: Joi.string().empty(),
    },
  }),
  userController.store,
);

router.patch(
  '/confirm-password',
  celebrate({
    [Segments.BODY]: {
      password: Joi.string().required(),
      activationToken: Joi.string().required(),
    },
  }),
  userController.confirmPassword,
);

export default router;
