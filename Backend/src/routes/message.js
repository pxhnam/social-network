import express from 'express';
import Controller from '../controllers/MessageController.js';
const router = express.Router();
import { Authenticate } from '../middleware/Auth.js';

router.get('/:chatId', Authenticate, Controller.Get);
router.post('/', Authenticate, Controller.Create);

export default router;
