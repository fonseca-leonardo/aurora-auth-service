import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import AuthenticationController from '../controller/AuthenticationController';

const router = Router();

const authenticationController = new AuthenticationController();

router.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  authenticationController.store,
);

router.post(
  '/forgot-password',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  authenticationController.forgotPassword,
);

export default router;
