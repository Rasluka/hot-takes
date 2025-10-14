import type { IUser } from "./user";

export interface IUserContext {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: IUser) => void;
  logout: () => void;
  updateUser: (user: IUser) => void;
}
