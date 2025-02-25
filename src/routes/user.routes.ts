import express from 'express';
import {addUser, authorizeUserToken, login} from '../controllers/user.controller';

const router = express.Router();

router.get('/users/:token', authorizeUserToken);
router.post('/users', addUser);
router.post('/users/login', login);

export default router;
