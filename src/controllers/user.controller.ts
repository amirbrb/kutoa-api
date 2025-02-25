import {Request, Response} from 'express';

import {User} from '../models/user.model';
import {UsersTableRow} from '../database/users/users.db.table';
import {usersDbService} from '../database/users/users.db.service';

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

export const authorizeUserToken = async (req: Request, res: Response) => {
  const {token} = req.params;
  try {
    const user = await usersDbService.fetchUserByToken(token as string);

    if (!user) {
      res.status(401).send({message: 'UnAuthorized', data: null});
    } else {
      res.status(200).send({data: toUI(user)});
    }
  } catch (error) {
    res.status(500).send({message: 'Error authorizing user', data: null});
  }
};

export const addUser = async (req: Request<User>, res: Response) => {
  const user = req.body as User;
  try {
    await usersDbService.addUserToDb(user);
    res.status(200).send({data: user});
  } catch (error) {
    res.status(500).send({message: 'Error adding user', data: null});
  }
};

export const login = async (req: Request<{email: string; password: string}>, res: Response) => {
  const {email, password} = req.body;
  try {
    const user = await usersDbService.fetchUserByEmail(email);
    if (!user) {
      res.status(401).send({message: 'UnAuthorized', data: null});
    } else if (user.password !== password) {
      res.status(401).send({message: 'Wrong user name or password', data: null});
    } else {
      res.status(200).send({data: {userData: toUI(user), token: user.token}});
    }
  } catch (error) {
    res.status(500).send({message: 'Error logging in', data: null});
  }
};
