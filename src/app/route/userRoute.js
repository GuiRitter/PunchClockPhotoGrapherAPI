import express from 'express';

import { checkToken, signIn } from '../controller/userController';

import verifyAuth from '../middleware/verifyAuth';

const router = express.Router();

router.get('/check', verifyAuth, checkToken);
router.post('/sign_in', signIn);

export default router;
