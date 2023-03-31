import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { get, put } from '../controller/entryController';

const router = express.Router();

router.get('/get', verifyAuth, get);
router.post('/put', verifyAuth, put);

export default router;
