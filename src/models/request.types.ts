import {Request} from 'express';
import {UsersTableRow} from '../database/users/users.db.table';

interface AuthRequest extends Request {
  user?: UsersTableRow;
}

export {AuthRequest};
