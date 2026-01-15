import { TakeEntity } from '../entities/take.entity';
import { TakeResponseDto } from '../dto/take/take-response.dto';

export const mapTakeToResponseDto = (take: TakeEntity): TakeResponseDto => {
  return {
    id: take.id,
    content: take.content,
    createdAt: take.createdAt,
    updatedAt: take.updatedAt,
    createdBy: {
      id: take.user.id,
      nickname: take.user.nickname,
    },
  };
};
