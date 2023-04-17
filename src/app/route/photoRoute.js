import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { deletePhoto, get, list, put } from '../controller/photoController';

const router = express.Router();

router.delete('/delete', verifyAuth, deletePhoto);
router.get('/get', verifyAuth, get);
router.get('/list', verifyAuth, list);
router.post('/put', verifyAuth, put);

export default router;
