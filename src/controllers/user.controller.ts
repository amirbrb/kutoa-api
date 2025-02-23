import {Request, Response} from 'express';

import {fetchUserByToken} from '../database/users/users.db.service';
import {User} from '../models/user.model';
import {UsersTableRow} from '../database/users/users.db.table';

const toUI = (userRow: UsersTableRow): User => ({
  id: userRow.id,
  firstName: userRow.first_name,
  lastName: userRow.last_name,
  email: userRow.email,
  role: userRow.role,
  source: userRow.source,
  status: userRow.status,
  password: userRow.password,
  profileImage: userRow.profile_image,
  token: userRow.token,
});

export const authorizeUserToken = async (req: Request, res: Response) => {
  const {token} = req.params;
  try {
    const user = await fetchUserByToken(token as string);

    if (!user) {
      res.status(401).send({message: 'UnAuthorized', data: null});
    } else {
      res.status(200).send({data: toUI(user)});
    }
  } catch (error) {
    res.status(500).send({message: 'Error authorizing user', data: null});
  }
};
