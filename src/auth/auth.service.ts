import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/lib/prisma.service';
import { UtilsService } from '@/lib/utils.service';
import { User, Admin } from '@prisma/client';
import { Role } from '@/app.type';
import { AuthToken, AuthTokenPayload, RefreshTokenPayload } from './auth.type';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User | Admin, role: Role): Promise<AuthToken> {
    const accessTimes: [number, string] =
      role === Role.User ? [24, '24h'] : [6, '6h'];

    const refreshTimes: [number, string] =
      role === Role.User ? [7, '1week'] : [12, '12h'];

    const accessExpired = new Date();
    accessExpired.setDate(accessExpired.getHours() + accessTimes[0]);

    const refreshExpired = new Date();
    refreshExpired.setDate(refreshExpired.getDate() + refreshTimes[0]);

    const refreshToken = randomUUID();

    const query =
      role === Role.User
        ? this.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
          })
        : this.prisma.admin.update({
            where: { id: user.id },
            data: { refreshToken },
          });

    await query;

    const accessPayload: AuthTokenPayload = { id: user.id, role };
    const refreshPayload: RefreshTokenPayload = { token: refreshToken, role };

    return {
      user,
      token: {
        access: {
          token: this.jwtService.sign(accessPayload, {
            expiresIn: accessTimes[1],
          }),
          expiredAt: accessExpired,
        },
        refresh: {
          token: this.jwtService.sign(refreshPayload, {
            expiresIn: refreshTimes[1],
          }),
          expiredAt: refreshExpired,
        },
      },
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        auth: true,
      },
    });
    if (!user) return null;
    if (!(await this.utils.checkPassword(password, user.auth.password)))
      return null;
    delete user.auth;
    return user;
  }

  async validateAdmin(email: string, password: string): Promise<Admin> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        email,
      },
      include: {
        auth: true,
      },
    });
    if (!admin) return null;
    if (!(await this.utils.checkPassword(password, admin.auth.password)))
      return null;
    delete admin.auth;
    return admin;
  }
}
