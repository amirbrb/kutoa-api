import { Request, Response } from 'express';

import { fetchUserByToken } from '../database/users/users.db.service';

export const authorizeUserToken = async (req: Request, res: Response) => {
  const {token} = req.params;
  try {
    const user = await fetchUserByToken(token as string);

    if (!user) {
      res.status(401).send({message: 'UnAuthorized', data: null});
    } else {
      res.status(200).send({data: user});
    }
  } catch (error) {
    res.status(500).send({message: 'Error authorizing user', data: null});
  }
};
