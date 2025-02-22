import {RowDataPacket} from 'mysql2';
import {User} from '../../models/user.model';
import db from '../../db';
import {usersTable} from './users.db.table';

function readUser(row: RowDataPacket): User {
  if (!row) return null;

  const {id, first_name, last_name, token, profile_image, role, source, email, password} = row;
  return {
    id,
    firstName: first_name,
    lastName: last_name,
    token,
    profileImage: profile_image,
    role,
    source,
    email,
    password,
  };
}

export async function fetchUserByToken(token: string): Promise<User> {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM ${usersTable.tableName} WHERE ${usersTable.columns.token}=?`, [token]);
  return readUser(result[0]);
}
