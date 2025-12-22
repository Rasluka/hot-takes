import type { JSX } from "react";
import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserContextType } from "../types/user-context";
import type { UserType } from "../types/user";
import { getCurrentUser, userLogout } from "../services/authService";

interface UserProviderProps {
  children: ReactNode;
}

const defaultState: UserContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  logout: async () => {},
  updateUser: () => {},
};

export const UserContext = createContext<UserContextType | undefined>(
  defaultState
);

export const UserProvider = ({ children }: UserProviderProps): JSX.Element => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = (newUser: UserType) => {
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await userLogout();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (updatedUser: UserType) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);

        const user = await getCurrentUser();
        setUser(user);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, login, logout, updateUser, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
