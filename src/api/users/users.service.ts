import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma.service';
import { User, Prisma } from '@prisma/client';
import { ListResponse } from '@/app.type';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<ListResponse<User>> {
    const { skip, take, cursor, where, orderBy } = params;
    const data = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    const count = await this.prisma.user.count();
    return { data, count };
  }

  async createUser({
    password,
    ...data
  }: Prisma.UserCreateInput & { password: string }): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        auth: {
          create: {
            password,
          },
        },
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async updatePassword(params: {
    userId: string;
    password: string;
  }): Promise<boolean> {
    const { userId, password } = params;
    const changePass = await this.prisma.auth.update({
      data: { password },
      where: { userId },
    });

    if (changePass.userId) return true;
    return false;
  }

  async softDeleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.update({
      data: { active: false },
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
