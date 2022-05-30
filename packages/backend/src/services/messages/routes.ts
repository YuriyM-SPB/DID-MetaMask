import express from 'express';

import * as controller from './controller';

export const router = express.Router();

router.route('/').post(controller.msg);

router.route('/').get(controller.resp);

router.route('/').delete(controller.clear);