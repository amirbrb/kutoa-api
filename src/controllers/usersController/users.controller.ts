import {Request} from 'express';

import {User, UserStatus} from '../../models/user.model';
import {UsersTableRow} from '../../database/users/users.db.table';
import {usersDbService} from '../../database/users/users.db.service';
import {getRequestToken} from '../utils/getRequestToken';
import {ControllerResponse, ErrorResponse} from '../models/controllerResponse.types';
import {toUserError} from '../controller.base';
import {emailService} from '../../messaging/email.service';
import {generateWelcomeEmail} from './users.controller.consts';

const toUI = (userRow: UsersTableRow): User => ({
  id: userRow.id,
  firstName: userRow.first_name,
  lastName: userRow.last_name,
  email: userRow.email,
  role: userRow.role,
  source: userRow.source,
  status: userRow.status,
  profileImage: userRow.profile_image,
});

const getCurrentUser = async (req: Request, res: ControllerResponse<User>) => {
  const token = getRequestToken(req);
  try {
    const user = await usersDbService.fetchUserByToken(token as string);

    if (!user) {
      res.status(401).send({message: 'UnAuthorized'});
    } else {
      res.status(200).send({data: toUI(user), message: 'User authorized successfully'});
    }
  } catch (error) {
    res.status(500).send({message: toUserError(error as Error)});
  }
};

const signupUsingGoogle = async (req: Request<User>, res: ControllerResponse<{user: User; token: string}>) => {
  const user = req.body;
  try {
    const userData = await usersDbService.addGooglelUser(user);
    res.status(200).send({message: 'User signed up successfully', data: {user: toUI(userData), token: userData.token}});
  } catch (error) {
    res.status(500).send({message: toUserError(error as Error)});
  }
};

const signup = async (
  req: Request<{email: string; password: string; firstName: string; lastName: string; profileImage: string}>,
  res: ControllerResponse<void | ErrorResponse>,
) => {
  const {email, password, firstName, lastName, profileImage} = req.body;
  try {
    await usersDbService.addUserToDb({email, password, firstName, lastName, profileImage, status: UserStatus.Pending});
    emailService.sendEmail({
      to: email,
      subject: 'Welcome to the Kutoa Community! 🎉',
      text: generateWelcomeEmail(firstName, email),
    });
    res.status(200).send({message: 'User signed up successfully'});
  } catch (error) {
    res.status(500).send({message: toUserError(error as Error)});
  }
};

const login = async (req: Request<{email: string; password: string}>, res: ControllerResponse<{user: User; token: string}>) => {
  const {email, password} = req.body;
  try {
    const user = await usersDbService.loginWithCredentials(email, password);
    if (!user) {
      res.status(401).send({message: 'UnAuthorized', data: null});
    } else if (user.password !== password) {
      res.status(401).send({message: 'Wrong user name or password', data: null});
    } else {
      res.status(200).send({data: {userData: toUI(user), token: user.token}});
    }
  } catch (error) {
    res.status(500).send({message: toUserError(error as Error)});
  }
};

const loginUsingGoogle = async (req: Request<User>, res: ControllerResponse<{user: User; token: string}>) => {
  const user = req.body;
  try {
    const userData = await usersDbService.loginWithGoogle(user);
    res.status(200).send({message: 'User logged in successfully', data: {user: toUI(userData), token: userData.token}});
  } catch (error) {
    res.status(500).send({message: toUserError(error as Error)});
  }
};

const activateUser = async (req: Request, res: ControllerResponse<{user: User; token: string}>) => {
  const {email} = req.params;
  try {
    const user = await usersDbService.activateUser(email as string);
    res.status(200).send({message: 'User activated successfully', data: {user: toUI(user), token: user.token}});
  } catch (error) {
    res.status(500).send({message: toUserError(error as Error)});
  }
};

export const usersController = {
  getCurrentUser,
  signupUsingGoogle,
  signup,
  login,
  loginUsingGoogle,
  activateUser,
};
