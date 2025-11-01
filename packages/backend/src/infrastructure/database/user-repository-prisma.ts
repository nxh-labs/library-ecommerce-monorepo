import { IUserRepository, UserId, Email, FindUsersOptions, User, UserRoleValue, UserRole } from '@/domain';
import { CountOptions } from '@/domain/repositories/user-repository';
import { PrismaClient, UserRole as PrismaUserRole } from '@prisma/client';

export class UserRepositoryPrisma implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async findById(id: UserId): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id: id.getValue() },
    });

    if (!userData) return null;

    return this.mapToDomain(userData);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    if (!userData) return null;

    return this.mapToDomain(userData);
  }

  async findAll(options: FindUsersOptions): Promise<User[]> {
    const where: any = {};

    if (options.role) {
      where.role = options.role;
    }

    if (options.search) {
      where.OR = [
        { firstName: { contains: options.search, mode: 'insensitive' } },
        { lastName: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const query: any = {
      where,
      orderBy: { createdAt: 'desc' },
    };

    if (options.offset !== undefined) {
      query.skip = options.offset;
    }

    if (options.limit !== undefined) {
      query.take = options.limit;
    }

    const usersData = await this.prisma.user.findMany(query);

    return usersData.map(userData => this.mapToDomain(userData));
  }

  async count(options: CountOptions): Promise<number> {
    const where: any = {};

    if (options.role) {
      where.role = options.role;
    }

    return await this.prisma.user.count({ where });
  }

  async save(user: User): Promise<void> {
    const data = this.mapToPrisma(user);

    await this.prisma.user.upsert({
      where: { id: user.getId().getValue() },
      update: data,
      create: data,
    });
  }

  async update(user: User): Promise<void> {
    const data = this.mapToPrisma(user);

    await this.prisma.user.update({
      where: { id: user.getId().getValue() },
      data,
    });
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({
      where: { id: id.getValue() },
    });
  }

  async updateLastLogin(id: UserId): Promise<void> {
    await this.prisma.user.update({
      where: { id: id.getValue() },
      data: { lastLoginAt: new Date() },
    });
  }

  private mapToDomain(userData: any): User {
    return new User(
      new UserId(userData.id),
      new Email(userData.email),
      userData.passwordHash,
      userData.firstName,
      userData.lastName,
      new UserRoleValue(this.mapPrismaUserRoleToDomainUserRole(userData.role)),
      userData.createdAt,
      userData.updatedAt,
      userData.lastLoginAt
    );
  }

  private mapToPrisma(user: User): any {
    return {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      passwordHash: user.getPasswordHash(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      role: this.mapDomainUserRoleToPrismaUserRole(user.getRole().getValue()),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      lastLoginAt: user.getLastLoginAt(),
    };
  }

  private mapDomainUserRoleToPrismaUserRole(userRole: UserRole): PrismaUserRole {
    switch (userRole) {
      case UserRole.ADMIN: return PrismaUserRole.ADMIN;
      case UserRole.CUSTOMER: return PrismaUserRole.CUSTOMER;
      case UserRole.MANAGER: return PrismaUserRole.MANAGER;
      default: throw new Error("user role not supported");
    }
  }
  private mapPrismaUserRoleToDomainUserRole(prismaUserRole:PrismaUserRole):UserRole {
    switch(prismaUserRole) {
      case PrismaUserRole.ADMIN: return UserRole.ADMIN;
      case PrismaUserRole.CUSTOMER: return UserRole.CUSTOMER;
      case PrismaUserRole.MANAGER: return UserRole.MANAGER;
      default: throw new Error("This user role not supported")
    }
  } 
}