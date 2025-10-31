import { CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase, ChangePasswordUseCase, GetUserUseCase, GetUsersUseCase, CreateUserDto, UpdateUserDto, ChangePasswordDto, UserSearchDto } from '@/application';
import { AuthenticatedRequest } from '@/infrastructure';
import { Request, Response, NextFunction } from 'express';


export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase
  ) {}

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateUserDto = req.body;
      const user = await this.createUserUseCase.execute(dto);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id.getValue();
      const user = await this.getUserUseCase.execute(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateCurrentUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id.getValue();
      const dto: UpdateUserDto = req.body;
      const user = await this.updateUserUseCase.execute(userId, dto);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id.getValue();
      const dto: ChangePasswordDto = req.body;
      await this.changePasswordUseCase.execute(userId, dto);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }
      const user = await this.getUserUseCase.execute(id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: UserSearchDto = req.query as any;
      const users = await this.getUsersUseCase.execute(dto);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }
      await this.deleteUserUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}