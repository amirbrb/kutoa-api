import {Request} from 'express';

export const getRequestToken = (req: Request) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  return token;
};
