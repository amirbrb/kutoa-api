import express from 'express';
import {authorizeUserToken} from '../controllers/user.controller';

const router = express.Router();

router.get('/users/:token', authorizeUserToken);

export default router;
