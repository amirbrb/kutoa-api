import {Request} from 'express';

function getRequestToken(req: Request) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  return token;
}

export default getRequestToken;
