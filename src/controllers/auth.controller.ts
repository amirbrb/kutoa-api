import {Request, Response} from 'express';
import db from '../db';

export const isAuthorized = async (req: Request, res: Response) => {
  const {token} = req.query;
  try {
    const [result] = await db.query('SELECT ut.* FROM user u INNER JOIN user_token ut ON u.id = ut.user_id WHERE token=?', [token]);
    if (!result) {
      res.status(401).json({message: 'UnAuthorized', data: false});
    } else {
      res.status(200).json({data: true});
    }
  } catch (error) {
    res.status(500).json({message: 'Error authorizing user'});
  }
};
