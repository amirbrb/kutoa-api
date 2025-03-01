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

async function addGooglelUser(user: User) {
  const token = generateToken();
  const tokenExpiry = generateTokenExpiry();
  const currentUser = await fetchUserByEmail(user.email);
  if (currentUser) {
    if (currentUser.source !== UserSource.Google) {
      throw new Error('User already signed in with a different provider');
    }

    await db.query(
      `UPDATE ${usersTable.tableName} SET ${usersTable.columns.token} = ?, ${usersTable.columns.tokenExpiry} = ? WHERE ${usersTable.columns.email} = ?`,
      [user.email, token, tokenExpiry],
    );
  } else {
    await addUserToDb({
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      status: UserStatus.Active,
      profileImage: user.profileImage,
    });
  }

  return {...currentUser, token, token_expiry: tokenExpiry};
}

async function addUserToDb({
  email,
  password,
  firstName,
  lastName,
  profileImage,
  status,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  status?: UserStatus;
}) {
  const currentUser = await fetchUserByEmail(email);
  if (currentUser) {
    throw new Error('User already exists');
  } else {
    await db.query(
      `INSERT INTO ${usersTable.tableName} (${usersTable.columns.firstName}, ${usersTable.columns.lastName}, ${usersTable.columns.email}, ${usersTable.columns.password}, ${usersTable.columns.role}, ${usersTable.columns.source}, ${usersTable.columns.status}, ${usersTable.columns.profileImage}) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, password, UserRole.User, UserSource.Local, status, profileImage],
    );
  }
}

async function loginWithCredentials(email: string, password: string) {
  const user = await fetchUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.password !== password) {
    throw new Error('Invalid password');
  }

  const token = generateToken();
  const tokenExpiry = generateTokenExpiry();

  await db.query(
    `UPDATE ${usersTable.tableName} SET ${usersTable.columns.token} = ?, ${usersTable.columns.tokenExpiry} = ? WHERE ${usersTable.columns.email} = ?`,
    [token, tokenExpiry, email],
  );

  return {...user, token, token_expiry: tokenExpiry};
}

async function loginWithGoogle(user: {email: string; firstName: string; lastName: string; profileImage: string}) {
  const currentUser = await fetchUserByEmail(user.email);
  if (!currentUser) {
    throw new Error('User not found');
  }

  if (currentUser.source !== UserSource.Google) {
    throw new Error('User not registered with Google');
  }

  const token = generateToken();
  const tokenExpiry = generateTokenExpiry();

  await db.query(
    `UPDATE ${usersTable.tableName} SET ${usersTable.columns.token} = ?, ${usersTable.columns.tokenExpiry} = ? WHERE ${usersTable.columns.email} = ?`,
    [token, tokenExpiry, user.email],
  );

  return {...currentUser, token, token_expiry: tokenExpiry};
}

async function activateUser(email: string) {
  const token = generateToken();
  const tokenExpiry = generateTokenExpiry();
  await db.query(
    `UPDATE ${usersTable.tableName} SET ${usersTable.columns.status} = ?, ${usersTable.columns.token} = ?, ${usersTable.columns.tokenExpiry} = ? WHERE ${usersTable.columns.email} = ?`,
    [UserStatus.Active, token, tokenExpiry, email],
  );

  const user = await fetchUserByEmail(email);
  const spread = {...user, token, token_expiry: tokenExpiry};
  return spread;
}

export const usersDbService = {
  fetchUserByToken,
  addUserToDb,
  addGooglelUser,
  loginWithCredentials,
  loginWithGoogle,
  activateUser,
};
