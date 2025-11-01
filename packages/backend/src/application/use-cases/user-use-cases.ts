import { IUserRepository, IUnitOfWork, UserId, Email, UserRoleValue, UserRole, User, FindUsersOptions } from "@/domain";
import { PasswordService } from "@/infrastructure/auth/password-service";
import { CreateUserDto, UserResponseDto, UpdateUserDto, ChangePasswordDto, UserSearchDto } from "../dto";


// Commands
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly passwordService: PasswordService
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const userId = new UserId(crypto.randomUUID());
    const email = new Email(dto.email);
    const role = new UserRoleValue(dto.role || UserRole.CUSTOMER);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const user = new User(
      userId,
      email,
      hashedPassword,
      dto.firstName,
      dto.lastName,
      role
    );

    const result = await this.unitOfWork.executeInTransaction(async (uow) => {
      const userRepository = uow.getUserRepository();
      await userRepository.save(user);
      return this.mapToResponseDto(user);
    });
    return result;
  }

  private async hashPassword(password: string): Promise<string> {
    return  this.passwordService.hashPassword(password)
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      role: user.getRole().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      lastLoginAt: user.getLastLoginAt()!
    };
  }
}

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const userId = new UserId(id);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (dto.firstName || dto.lastName) {
      user.updateName(dto.firstName || user.getFirstName(), dto.lastName || user.getLastName());
    }

    const result = await this.unitOfWork.executeInTransaction(async (uow) => {
      const userRepository = uow.getUserRepository();
      await userRepository.update(user);
      return this.mapToResponseDto(user);
    });
    return result;
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      role: user.getRole().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      lastLoginAt: user.getLastLoginAt()!
    };
  }
}

export class DeleteUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string): Promise<void> {
    const userId = new UserId(id);
    await this.unitOfWork.executeInTransaction(async (uow) => {
      const userRepository = uow.getUserRepository();
      await userRepository.delete(userId);
    });
  }
}

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly passwordService: PasswordService
  ) {}

  async execute(id: string, dto: ChangePasswordDto): Promise<void> {
    const userId = new UserId(id);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.verifyPassword(dto.currentPassword, user.getPasswordHash());
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const newHashedPassword = await this.hashPassword(dto.newPassword);
    user.updatePassword(newHashedPassword);

    await this.unitOfWork.executeInTransaction(async (uow) => {
      const userRepository = uow.getUserRepository();
      await userRepository.update(user);
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return this.passwordService.hashPassword(password)
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return this.passwordService.verifyPassword(password,hash)
  }
}

// Queries
export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserResponseDto | null> {
    const userId = new UserId(id);
    const user = await this.userRepository.findById(userId);
    return user ? this.mapToResponseDto(user) : null;
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      role: user.getRole().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      lastLoginAt: user.getLastLoginAt()!
    };
  }
}

export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: UserSearchDto): Promise<UserResponseDto[]> {
    const options:FindUsersOptions = {
      limit: dto.limit || 20,
      offset: dto.offset || 0,
      role: dto.role!,
      search: dto.search!
    };

    const users = await this.userRepository.findAll(options);
    return users.map(user => this.mapToResponseDto(user));
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      role: user.getRole().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      lastLoginAt: user.getLastLoginAt()!
    };
  }
}