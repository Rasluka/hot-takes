import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { IUserContext } from "../types/user-context";
import type { IUser } from "../types/user";

// Interface use to describe the props received by the UserProvider
interface UserProviderProps {
  children: ReactNode;
}

const defaultState: IUserContext = {
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
};

export const UserContext = createContext<IUserContext | undefined>(
  defaultState
);

// This will wrap my app to provide the states info and methods.
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (newUser: IUser) => {
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {}, []);

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, login, logout, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
