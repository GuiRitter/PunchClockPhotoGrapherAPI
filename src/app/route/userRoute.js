import express from 'express';

import { signIn } from '../controller/userController';

const router = express.Router();

router.post('/sign_in', signIn);

export default router;

