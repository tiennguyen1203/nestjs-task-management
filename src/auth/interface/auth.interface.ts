export interface IUserResult {
  id: number;
  username: string;
  accessToken: string;
}

export interface IJwtPayload {
  id: number;
  username: string;
}