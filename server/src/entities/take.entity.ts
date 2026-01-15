export interface TakeEntity {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  user: {
    id: number;
    nickname: string;
  };
}
