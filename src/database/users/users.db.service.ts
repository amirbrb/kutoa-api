import {RowDataPacket} from 'mysql2';
import db from '../../db';
import {usersTable, UsersTableRow} from './users.db.table';

function readUser(row: RowDataPacket): UsersTableRow {
  if (!row) return null;

  const {id, first_name, last_name, token, token_expiry, profile_image, role, source, email, password, status} = row;
  return {
    id,
    first_name,
    last_name,
    token,
    profile_image,
    role,
    source,
    email,
    password,
    status,
    token_expiry,
  };
}

export async function fetchUserByToken(token: string): Promise<UsersTableRow> {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM ${usersTable.tableName} WHERE ${usersTable.columns.token}=?`, [token]);
  const user = readUser(result[0]);

  if (!user) return null;

  //if token expiry is lower than now, remove the token
  if (user.token_expiry <= new Date()) {
    db.query(
      `UPDATE ${usersTable.tableName} SET ${usersTable.columns.token}=NULL, ${usersTable.columns.tokenExpiry}=NULL WHERE ${usersTable.columns.id} = ${user.id}`,
    );

    return null;
  }

  return user;
}
