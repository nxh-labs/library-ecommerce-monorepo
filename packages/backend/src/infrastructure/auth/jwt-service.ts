import { User } from '@/domain';
import jwt ,{SignOptions} from 'jsonwebtoken';
import { InternalServerError } from '@/domain/errors';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class JWTService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  generateTokens(user: User): AuthTokens {
    const payload: JWTPayload = {
      userId: user.getId().getValue(),
      email: user.getEmail().getValue(),
      role: user.getRole().getValue(),
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.accessTokenExpiry,
    } as SignOptions);

    const refreshToken = jwt.sign(
      { userId: user.getId().getValue() },
      this.jwtRefreshSecret,
      { expiresIn: this.refreshTokenExpiry } as SignOptions
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload;
    } catch (error) {
      throw new InternalServerError('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string): { userId: string } {
    try {
      return jwt.verify(token, this.jwtRefreshSecret) as { userId: string };
    } catch (error) {
      throw new InternalServerError('Invalid or expired refresh token');
    }
  }

  refreshAccessToken(refreshToken: string): string {
    const { userId } = this.verifyRefreshToken(refreshToken);

    const payload = {
      userId
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.accessTokenExpiry,
    } as SignOptions);
  }

  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}