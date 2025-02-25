import {RowDataPacket} from 'mysql2';
import db from '../../db';
import {usersTable, UsersTableRow} from './users.db.table';
import {User, UserSource} from '../../models/user.model';
import crypto from 'crypto';
import {DateTime} from 'luxon';

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

/**
 * Adds a user to DB
 * If user already exists AND the source is from google, updates the token for the user
 * @param user user data
 */
async function addUserToDb(user: User) {
  const token = crypto.randomBytes(64).toString('hex');
  const tokenExpiry = DateTime.now().plus({days: 7}).toJSDate();

  const currentUser = await fetchUserByEmail(user.email);
  if (currentUser) {
    if (currentUser.source !== UserSource.Google) {
      throw new Error('User already exists');
    } else {
      await db.query(
        `UPDATE ${usersTable.tableName} SET ${usersTable.columns.token} = ?, ${usersTable.columns.tokenExpiry} = ? WHERE ${usersTable.columns.email} = ?`,
        [user.email, token, tokenExpiry],
      );
    }
  } else {
    const {firstName, lastName, email, password, role, source, status, profileImage} = user;
    await db.query(
      `INSERT INTO ${usersTable.tableName} (${usersTable.columns.firstName}, ${usersTable.columns.lastName}, ${usersTable.columns.email}, ${usersTable.columns.password}, ${usersTable.columns.role}, ${usersTable.columns.source}, ${usersTable.columns.status}, ${usersTable.columns.profileImage}, ${usersTable.columns.token}, ${usersTable.columns.tokenExpiry}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, password, role, source, status, profileImage, token, tokenExpiry],
    );
  }
}

export const usersDbService = {
  fetchUserByToken,
  fetchUserByEmail,
  addUserToDb,
};
