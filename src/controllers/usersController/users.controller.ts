import {Request} from 'express';

import {User, UserRole, UserSource, UserStatus} from '../../models/user.model';
import {usersDbService} from '../../database/users/users.db.service';
import {getRequestToken} from '../../utils/common/getRequestToken';
import {ControllerResponse, ErrorResponse} from '../../models/response.types';
import {toUserError} from '../controller.base';
import {emailService} from '../../messaging/email.service';
import {generateWelcomeEmail} from '../../messaging/utils/generateWelcomeEmail';
import {LoginStatus} from './users.controller.enums';
import {UsersTableRow} from '../../database/users/users.db.table';

const toUserUI = (userRow: UsersTableRow): User => ({
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
      return;
    }

    const userUI = toUserUI(user);
    res.status(200).send({data: userUI, message: 'User authorized successfully'});
  } catch (error) {
    res.status(500).send({message: toUserError(error as Error)});
  }
};

const signupUsingGoogle = async (req: Request<User>, res: ControllerResponse<{user: User; token: string}>) => {
  const user = req.body;
  try {
    const currentUser = await usersDbService.fetchUserByEmail(user.email);
    if (currentUser) {
      if (currentUser.source !== UserSource.Google) {
        res.status(401).send({message: 'User already signed in with a different provider'});
        return;
      }
    } else {
      const userData = await usersDbService.addUserToDb({
        ...user,
        password: '',
        status: UserStatus.Active,
        role: UserRole.User,
        source: UserSource.Google,
      });

      res.status(200).send({message: 'User signed up successfully', data: {user: userData, token: userData.token}});
    }
  } catch (error) {
    res.status(500).send({message: toUserError(error as Error)});
  }
};

const signup = async (req: Request<User>, res: ControllerResponse<void | ErrorResponse>) => {
  const {email, password, firstName, lastName, profileImage} = req.body;
  try {
    const user = await usersDbService.fetchUserByEmail(email);
    if (user) {
      res.status(401).send({message: 'User already exists'});
      return;
    }

    const {token} = await usersDbService.addUserToDb({email, password, firstName, lastName, profileImage, status: UserStatus.Pending});
    emailService.sendEmail({
      to: email,
      subject: 'Welcome to the Kutoa Community! 🎉',
      text: generateWelcomeEmail(firstName, email, token, req.headers.origin),
    });
    res.status(200).send({message: 'User signed up successfully'});
  } catch (error) {
    res.status(500).send({message: toUserError(error as Error)});
  }
};

const login = async (req: Request<{email: string; password: string}>, res: ControllerResponse<{user: User; token: string}>) => {
  const {email, password} = req.body;
  try {
    const user = await usersDbService.fetchUserByEmail(email);
    if (!user) {
      res.status(401).send({message: 'User not found, did you signup?', status: LoginStatus.UserNotFound});
    } else if (user.password !== password) {
      res.status(401).send({message: 'Wrong user name or password', status: LoginStatus.WrongPassword});
    } else if (user.status !== UserStatus.Active) {
      res.status(401).send({message: 'User is not activated, please check your email for activation link', status: LoginStatus.UserNotActive});
    } else if (user.source !== UserSource.Local) {
      res.status(401).send({message: 'User is not registered with local account, try to login with Google', status: LoginStatus.LocalUser});
    } else {
      res.status(200).send({data: {userData: toUserUI(user), token: user.token}, status: LoginStatus.Success});
    }
  } catch (error) {
    res.status(500).send({message: toUserError(error as Error)});
  }
};

const loginUsingGoogle = async (req: Request, res: ControllerResponse<{user: User; token: string}>) => {
  const {email} = req.body;
  try {
    const userData = await usersDbService.fetchUserByEmail(email);
    if (!userData) {
      res.status(401).send({message: 'User not found, did you signup?', status: LoginStatus.UserNotFound});
    } else if (userData.source !== UserSource.Google) {
      res.status(401).send({message: 'User is not registered with Google, try to login with email and password', status: LoginStatus.LocalUser});
    } else {
      res.status(200).send({message: 'User logged in successfully', data: {user: toUserUI(userData), token: userData.token}});
    }
  } catch (error) {
    res.status(500).send({message: toUserError(error as Error)});
  }
};

const verifyEmail = async (req: Request<{email: string; token: string}>, res: ControllerResponse<{user: User; token: string}>) => {
  const {email, token} = req.body;
  try {
    const userData = await usersDbService.fetchUserByEmail(email);
    if (!userData) {
      res.status(401).send({message: 'User not found, did you signup?'});
    } else if (userData.token !== token) {
      res.status(401).send({message: 'Invalid token'});
    } else {
      await usersDbService.updateUserStatus(email, UserStatus.Active);
      const {token: newToken} = await usersDbService.refreshUserToken(email);
      res.status(200).send({message: 'Email verified successfully', data: {user: toUserUI(userData), token: newToken}});
    }
  } catch (error) {
    res.status(401).send({message: toUserError(error as Error)});
  }
};

const resendVerificationEmail = async (req: Request<{email: string}>, res: ControllerResponse<void | ErrorResponse>) => {
  const {email} = req.body;
  try {
    const user = await usersDbService.fetchUserByEmail(email);
    if (!user) {
      res.status(401).send({message: 'User not found'});
      return;
    }

    const {token} = await usersDbService.refreshUserToken(email);

    emailService.sendEmail({
      to: email,
      subject: 'Welcome to the Kutoa Community! 🎉',
      text: generateWelcomeEmail(user.first_name, email, token, req.headers.origin),
    });

    res.status(200).send({message: 'Verification email sent successfully'});
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
  verifyEmail,
  resendVerificationEmail,
};
