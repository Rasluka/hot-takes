import type { UserType } from "./user";

export interface UserContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: UserType) => void;
  logout: () => Promise<void>;
  updateUser: (user: UserType) => void;
}
