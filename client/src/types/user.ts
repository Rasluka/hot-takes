export interface UserType {
  id: number;
  nickname: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
}

export interface UserSignUpType {
  user: UserType;
  code: string;
  emailSent?: boolean;
}

export interface SignUpData {
  nickname: string;
  email: string;
}

export interface SignInData {
  nickname: string;
  code: string;
}
