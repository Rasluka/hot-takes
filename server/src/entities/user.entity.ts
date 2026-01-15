export interface UserEntity {
  id: number;
  nickname: string;
  email: string;
  hashedCode: string;
  roleId: number;
  role: {
    id: number;
    name: string;
  };
}
