import { LoginUseCase, ValidateTokenUseCase, RefreshTokenUseCase, LoginDto } from '@/application';
import { AuthenticatedRequest } from '@/infrastructure';
import { Request, Response, NextFunction } from 'express';


export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: LoginDto = req.body;
      const authResponse = await this.loginUseCase.execute(dto);
      res.json(authResponse);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token is required' });
        return;
      }
      const authResponse = await this.refreshTokenUseCase.execute(refreshToken);
      res.json(authResponse);
    } catch (error) {
      next(error);
    }
  }

  async validateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Token is already validated by middleware
      res.json({
        valid: true,
        user: {
          id: req.user!.id.getValue(),
          email: req.user!.email,
          role: req.user!.role.getValue()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a real implementation, you might want to blacklist the token
      // For now, just return success
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
}