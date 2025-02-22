import express from 'express';
import {isAuthorized} from '../controllers/auth.controller';

const router = express.Router();

router.get('/is-authorized', isAuthorized);

export default router;
