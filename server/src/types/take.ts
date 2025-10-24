export interface Take {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
}

export interface FavoriteTake {
  id: number;
  userId: number;
  takeId: number;
  take: Take;
}
