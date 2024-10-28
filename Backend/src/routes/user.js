import express from 'express';
import Controller from '../controllers/UserController.js';
import { Authenticate } from '../middleware/Auth.js';
import AttachMiddleware from '../middleware/Attach.js';

const router = express.Router();

router.get('/profile', Authenticate, Controller.Profile);
router.post('/login', Controller.Login);
router.post('/logout', Controller.Logout);
router.post('/register', Controller.Register);
router.post('/follow', Authenticate, Controller.Follow);
router.post('/unfollow', Authenticate, Controller.UnFollow);
router.post('/', Controller.Create);

router.get('/:username', AttachMiddleware, Controller.Get);

export default router;
