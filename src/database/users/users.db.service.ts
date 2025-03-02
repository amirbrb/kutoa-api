import {RowDataPacket} from 'mysql2';
import db from '../../db';
import {usersTable, UsersTableRow} from './users.db.table';
import {User, UserRole, UserSource, UserStatus} from '../../models/user.model';
import {DateTime} from 'luxon';
import {generateToken, generateTokenExpiry} from './users.db.utils';

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

async function fetchUserByToken(token: string): Promise<UsersTableRow> {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM ${usersTable.tableName} WHERE ${usersTable.columns.token}=?`, [token]);
  const user = readUser(result[0]);

  if (!user) return null;

  //if token expiry is lower than now, remove the token
  if (user.token_expiry <= DateTime.now().toJSDate()) {
    db.query(
      `UPDATE ${usersTable.tableName} SET ${usersTable.columns.token}=NULL, ${usersTable.columns.tokenExpiry}=NULL WHERE ${usersTable.columns.id} = ${user.id}`,
    );

    return null;
  }

  return user;
}

async function fetchUserByEmail(email: string): Promise<UsersTableRow> {
  const [result] = await db.query<RowDataPacket[]>(`SELECT * FROM ${usersTable.tableName} WHERE ${usersTable.columns.email}=?`, [email]);
  const user = readUser(result[0]);

  return user;
}

async function addUserToDb(user: Partial<User>) {
  const currentUser = await fetchUserByEmail(user.email);
  if (currentUser) {
    throw new Error('User already exists');
  } else {
    const token = generateToken();
    const tokenExpiry = generateTokenExpiry();
    await db.query(
      `INSERT INTO ${usersTable.tableName} (${usersTable.columns.firstName}, ${usersTable.columns.lastName}, ${usersTable.columns.email}, ${usersTable.columns.password}, ${usersTable.columns.role}, ${usersTable.columns.source}, ${usersTable.columns.status}, ${usersTable.columns.profileImage}, ${usersTable.columns.token}, ${usersTable.columns.tokenExpiry}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.firstName, user.lastName, user.email, user.password, UserRole.User, UserSource.Local, user.status, user.profileImage, token, tokenExpiry],
    );

    return {...user, token, token_expiry: tokenExpiry};
  }
}

async function refreshUserToken(email: string) {
  const user = await fetchUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const token = generateToken();
  const tokenExpiry = generateTokenExpiry();

  await db.query(
    `UPDATE ${usersTable.tableName} SET ${usersTable.columns.token} = ?, ${usersTable.columns.tokenExpiry} = ? WHERE ${usersTable.columns.email} = ?`,
    [token, tokenExpiry, email],
  );

  return {token, token_expiry: tokenExpiry};
}

async function updateUserStatus(email: string, status: UserStatus) {
  await db.query(`UPDATE ${usersTable.tableName} SET ${usersTable.columns.status} = ? WHERE ${usersTable.columns.email} = ?`, [status, email]);
}

export const usersDbService = {
  fetchUserByEmail,
  fetchUserByToken,
  addUserToDb,
  refreshUserToken,
  updateUserStatus,
};
