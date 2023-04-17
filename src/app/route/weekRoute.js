import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { compose, deleteWeek } from '../controller/photoController';

const router = express.Router();

router.get('/compose', verifyAuth, compose);
router.delete('/delete', verifyAuth, deleteWeek);

export default router;
