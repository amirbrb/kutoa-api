export enum LoginStatus {
  Success = 1,
  UserNotFound = 2, //no user with this email found
  WrongPassword = 3, //user found but wrong password
  UserNotActive = 4, //user found but not active
  LocalUser = 5, //user is local
  GoogleUser = 6, //user is google
}
