export interface TakeResponseDto {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: number;
    nickname: string;
  };
}
