export enum UserRole {
  Admin = 1,
  User = 2,
}

export enum UserSource {
  Local = 1,
  Google = 2,
}

export enum UserStatus {
  Active = 1,
  Pending = 2,
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  profileImage?: string;
  role: UserRole;
  source: UserSource;
  email: string;
  password?: string;
  status: UserStatus;
}
