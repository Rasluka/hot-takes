export interface IRole {
  id: number;
  name: string;
}

export interface IUser {
  id: number;
  nickname: string;
  email: string;
  hashed_code?: string;
  role_id: number;
  role: IRole;
}
