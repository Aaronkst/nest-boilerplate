import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { AuthTokenPayload, RefreshTokenPayload } from './auth.type';
import { PrismaService } from '@/lib/prisma.service';
import { Role } from '@/app.type';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ id, role }: AuthTokenPayload) {
    try {
      if (role !== Role.User) return null;
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) return null;
      return user;
    } catch (e) {
      throw e;
    }
  }
}

@Injectable()
export class RefreshUserJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-user-jwt',
) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ token, role }: RefreshTokenPayload) {
    try {
      if (role !== Role.User) return null;
      const user = await this.prisma.user.findFirst({
        where: { refreshToken: token },
        orderBy: { updatedAt: 'desc' },
      });
      if (!user) return null;
      return user;
    } catch (e) {
      throw e;
    }
  }
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ id, role }: AuthTokenPayload) {
    try {
      if (role !== Role.Admin) return null;
      const admin = await this.prisma.admin.findUnique({ where: { id } });
      if (!admin) return null;
      return admin;
    } catch (e) {
      throw e;
    }
  }
}

@Injectable()
export class RefreshAdminJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-admin-jwt',
) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ token, role }: RefreshTokenPayload) {
    try {
      if (role !== Role.Admin) return null;
      const admin = await this.prisma.admin.findFirst({
        where: { refreshToken: token },
        orderBy: { updatedAt: 'desc' },
      });
      if (!admin) return null;
      return admin;
    } catch (e) {
      throw e;
    }
  }
}

@Injectable()
export class CompositeJwtStrategy extends PassportStrategy(
  Strategy,
  'composite-jwt',
) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ id, role }: AuthTokenPayload) {
    try {
      const query =
        role === Role.User
          ? this.prisma.user.findUnique({ where: { id } })
          : this.prisma.admin.findUnique({ where: { id } });

      const user = await query;
      if (!user) return null;
      return { ...user, role };
    } catch (e) {
      throw e;
    }
  }
}
