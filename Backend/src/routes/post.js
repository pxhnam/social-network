import express from 'express';
import Controller from '../controllers/PostController.js';
import { Authenticate } from '../middleware/Auth.js';
import AttachMiddleware from '../middleware/Attach.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get('/', AttachMiddleware, Controller.Get);
router.get('/auth/:username', AttachMiddleware, Controller.Auth);
router.post('/like', Authenticate, Controller.ToggleLike);

router.post('/', Authenticate, upload.array('attachments'), Controller.Create);

router.put('/', Authenticate, upload.array('attachments'), Controller.Update);
router.delete('/:id', Authenticate, Controller.Remove);

export default router;
