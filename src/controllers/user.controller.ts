import {Request, Response} from 'express';
import db from '../db';
import {User} from '../models/user.model';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({message: 'Error fetching users'});
  }
};

export const createUser = async (req: Request, res: Response) => {
  const {name, email} = req.body as User;
  try {
    await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({message: 'User created'});
  } catch (error) {
    res.status(500).json({message: 'Error creating user'});
  }
};
