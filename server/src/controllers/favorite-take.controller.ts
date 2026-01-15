import { Response } from 'express';
import { FavoriteTakeService } from '../services/favorite-take.service';
import { successApiResponse } from '../utils/api-response.util';
import { TakeResponseDto } from '../dto/take/take-response.dto';
import { BadRequest } from '../errors/bad-request.error';
import { AuthenticatedRequest } from '../types/auth-request';
import { FavoriteAddDto } from '../dto/favorite-take/favorite-take-create.dto';

export class FavoriteTakeController {
  constructor(private readonly favoriteTakeService: FavoriteTakeService) {}

  getUserFavorites = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const userId = req.user!.userId;

    if (isNaN(userId)) throw new BadRequest('Invalid User ID.');

    const results: TakeResponseDto[] =
      await this.favoriteTakeService.getUserFavorites(userId);

    return successApiResponse(
      res,
      200,
      results,
      'Favorite takes retrieved successfully!',
    );
  };

  addFavorite = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const userId = req.user!.userId;
    const favorite: FavoriteAddDto = req.body;

    if (!userId) throw new BadRequest('User not authenticated');

    const result = await this.favoriteTakeService.addFavorite(userId, favorite);

    return successApiResponse(
      res,
      201,
      result,
      'Take added as favorite successfully',
    );
  };

  removeFavorite = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const userId = req.user!.userId;
    const takeId = Number(req.params.takeId);

    if (!userId) throw new BadRequest('User not authenticated');
    if (isNaN(takeId)) throw new BadRequest('Invalid Take ID.');

    await this.favoriteTakeService.removeFavorite(userId, takeId);
    res.status(204).send();
    return;
  };
}
