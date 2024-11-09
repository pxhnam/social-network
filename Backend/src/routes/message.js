import express from 'express';
import Controller from '../controllers/MessageController.js';
const router = express.Router();
import { Authenticate } from '../middleware/Auth.js';
import upload from '../config/multer.js';

router.get('/:chatId', Authenticate, Controller.Get);
router.post('/', Authenticate, upload.array('attachments'), Controller.Create);

export default router;
