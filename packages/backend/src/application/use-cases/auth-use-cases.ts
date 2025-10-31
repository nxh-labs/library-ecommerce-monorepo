import { IUserRepository, Email, User, UserId } from "@/domain";
import { JWTService } from "@/infrastructure";
import { PasswordService } from "@/infrastructure/auth/password-service";
import { LoginDto, AuthResponseDto } from "../dto";

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JWTService,
    private readonly passwordService: PasswordService
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const email = new Email(dto.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.verifyPassword(dto.password, user.getPasswordHash());
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.recordLogin();
    await this.userRepository.updateLastLogin(user.getId());

    const { accessToken, refreshToken } = this.jwtService.generateTokens(user);

    return {
      user: {
        id: user.getId().getValue(),
        email: user.getEmail().getValue(),
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        role: user.getRole().getValue(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
        lastLoginAt: user.getLastLoginAt() || undefined
      },
      token: accessToken,
      refreshToken
    };
  }

}

export class ValidateTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JWTService
  ) {}

  async execute(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verifyAccessToken(token);
      const user = await this.userRepository.findById(new UserId(payload.userId));
      return user;
    } catch (error) {
      return null;
    }
  }
}

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JWTService
  ) {}

  async execute(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const { userId } = this.jwtService.verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(new UserId(userId));
      if (!user) {
        throw new Error('User not found');
      }

      const { accessToken, refreshToken: newRefreshToken } = this.jwtService.generateTokens(user);

      return {
        user: {
          id: user.getId().getValue(),
          email: user.getEmail().getValue(),
          firstName: user.getFirstName(),
          lastName: user.getLastName(),
          role: user.getRole().getValue(),
          createdAt: user.getCreatedAt(),
          updatedAt: user.getUpdatedAt(),
          lastLoginAt: user.getLastLoginAt() || undefined
        },
        token: accessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

}