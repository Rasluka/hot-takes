export interface IUser {
  id: number;
  nickname: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
}
