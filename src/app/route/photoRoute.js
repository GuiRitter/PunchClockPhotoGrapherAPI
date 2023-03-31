import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { get, put } from '../controller/photoController';

const router = express.Router();

router.get('/get', verifyAuth, get);
router.post('/put', verifyAuth, put);

export default router;
