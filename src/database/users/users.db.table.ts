import {UserRole, UserSource, UserStatus} from '../../models/user.model';

export const usersTable = {
  tableName: 'users',
  columns: {
    id: 'id',
    firstName: 'first_name',
    lastName: 'last_name',
    token: 'token',
    tokenExpiry: 'token_expiry',
    profileImage: 'profile_image',
    role: 'role',
    source: 'source',
    email: 'email',
    password: 'password',
    status: 'status',
  },
};

export interface UsersTableRow {
  id: number;
  first_name: string;
  last_name: string;
  token: string;
  token_expiry: Date;
  profile_image: string;
  role: UserRole;
  source: UserSource;
  email: string;
  password: string;
  status: UserStatus;
}
