export enum UserRole {
  ADMIN = 1,
  USER = 2,
}

export enum UserSource {
  Local = 1,
  Google = 2,
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  token?: string;
  profileImage?: string;
  role: UserRole;
  source: UserSource;
  email: string;
  password?: string;
}
