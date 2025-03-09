import {NextFunction, Response} from 'express';
import {usersDbService} from '../database/users/users.db.service';
import {AuthRequest} from '../models/request.types';

const toUserError = (error: Error) => {
  return error ? error.message : 'Unknown error';
};

const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) res.status(401).json({error: 'Unauthorized'});
  else {
    usersDbService
      .fetchUserByToken(token as string)
      .then((user) => {
        if (!user) return res.status(401).json({error: 'Unauthorized'});

        req.user = user;
        next();
      })
      .catch((error) => next(error));
  }
};

export {authenticateUser, toUserError};
