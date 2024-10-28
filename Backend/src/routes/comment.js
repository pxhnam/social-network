import express from 'express';
import Controller from '../controllers/CommentController.js';
const router = express.Router();
import { Authenticate } from '../middleware/Auth.js';

router.post('/', Authenticate, Controller.Create);
router.get('/count/:id', Controller.Count);
router.get('/:id', Controller.Get);
router.delete('/:id', Authenticate, Controller.Remove);

export default router;
