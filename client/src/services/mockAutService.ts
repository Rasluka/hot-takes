import type { UserType } from "../types/user";
import type { SignInData } from "../types/user";

const mockUser: UserType = {
  id: 2,
  nickname: "jorgeo",
  email: "vargklee@hotmail.com",
  role: { id: 1, name: "Admin" },
};

export const mockLogin = async (data: SignInData): Promise<UserType> => {
  // eslint-disable-next-line @typescript-eslint/typedef
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (data.code === "1234") {
    return mockUser;
  }

  throw new Error("Invalid credentials.");
};
