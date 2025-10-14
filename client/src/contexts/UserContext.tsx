import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { IUserContext } from "../types/user-context";
import type { IUser } from "../types/user";
import { getCurrentUser, userLogout } from "../services/authService";

interface UserProviderProps {
  children: ReactNode;
}

const defaultState: IUserContext = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
};

export const UserContext = createContext<IUserContext | undefined>(
  defaultState
);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = (newUser: IUser) => {
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await userLogout();
    } catch (error) {
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);

        const res = await getCurrentUser();
        setUser(res.data);
        setIsAuthenticated(true);
        console.log(res.data);
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, login, logout, updateUser, isLoading }}
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
