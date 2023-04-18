import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { deletePhoto, get, list, put } from '../controller/photoController';

const router = express.Router();

router.delete('/:dateTime', verifyAuth, deletePhoto);
router.get('/', verifyAuth, list);
router.get('/:dateTime', verifyAuth, get);
router.post('/put', verifyAuth, put);

export default router;
