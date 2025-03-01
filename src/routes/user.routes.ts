import express from 'express';
import {usersController} from '../controllers/usersController/users.controller';
const {getCurrentUser, login, loginUsingGoogle, signup, signupUsingGoogle, activateUser} = usersController;

const router = express.Router();

router.get('/users/current', getCurrentUser);
router.post('/users/login', login);
router.post('/users/login/google', loginUsingGoogle);
router.post('/users/signup', signup);
router.post('/users/signup/google', signupUsingGoogle);
router.post('/users/verify-email/:email', activateUser);

export default router;
