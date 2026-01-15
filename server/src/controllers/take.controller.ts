import { Request, Response } from 'express';
import { TakeService } from '../services/take.service';
import { successApiResponse } from '../utils/api-response.util';
import { BadRequest } from '../errors/bad-request.error';
import { AuthenticatedRequest } from '../types/auth-request';
import { TakeResponseDto } from '../dto/take/take-response.dto';
import { TakeCreateDto } from '../dto/take/take-create.dto';
import { TakeUpdateDto } from '../dto/take/take-update.dto';

export class TakeController {
  private takeService: TakeService;

  constructor(takeService: TakeService) {
    this.takeService = takeService;
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const results: TakeResponseDto[] = await this.takeService.getAll();

    return successApiResponse(
      res,
      200,
      results,
      'Takes retrieved succesfully!',
    );
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const takeId = Number(req.params.id);

    if (isNaN(takeId)) throw new BadRequest('Invalid ID');

    const result = await this.takeService.getById(takeId);

    return successApiResponse(res, 200, result, 'Role retrieved succesfully!');
  };

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const takeData: TakeCreateDto = req.body;
    const { user } = req;

    if (!takeData.content.trim())
      throw new BadRequest('Take content was not provided');

    if (!user?.userId) throw new BadRequest('User id was not provided');

    const result = await this.takeService.create(takeData, user.userId);

    return successApiResponse(res, 201, result, 'Take succesfully created!');
  };

  updateById = async (req: Request, res: Response): Promise<void> => {
    const takeId = Number(req.params.id);
    const takeData: TakeUpdateDto = req.body;

    if (isNaN(takeId)) throw new BadRequest('Invalid ID.');

    if (!takeData.content.trim())
      throw new BadRequest('Take content was not provided.');

    const result = await this.takeService.updateById(takeId, takeData);

    return successApiResponse(res, 200, result, 'Take updated succesfully!');
  };

  deleteById = async (req: Request, res: Response): Promise<void> => {
    const takeId = Number(req.params.id);

    if (isNaN(takeId)) {
      throw new BadRequest('Invalid ID');
    }

    const result = await this.takeService.deleteById(takeId);

    return successApiResponse(res, 200, result, 'Take deleted succesfully!');
  };
}
