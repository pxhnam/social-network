import express from 'express';
import Controller from '../controllers/ChatController.js';
const router = express.Router();
import { Authenticate } from '../middleware/Auth.js';

router.get('/', Authenticate, Controller.Get);
router.post('/private', Authenticate, Controller.Private);

export default router;
