import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

interface IThemeContext {
  currentTheme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const defaultState: IThemeContext = {
  currentTheme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
};

export const ThemeContext = createContext<IThemeContext>(defaultState);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(() => {
    const storedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;

    if (storedTheme) return storedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (theme: "light" | "dark") => {
    setCurrentTheme(theme);
  };

  useEffect(() => {
    localStorage.setItem("theme", currentTheme);
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      setCurrentTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);

    document.documentElement.setAttribute("data-theme", currentTheme);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
