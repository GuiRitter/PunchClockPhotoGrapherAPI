import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { compose, deleteWeek } from '../controller/photoController';

const router = express.Router();

router.get('/:week/compose', verifyAuth, compose);
router.delete('/:week', verifyAuth, deleteWeek);

export default router;
