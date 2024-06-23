import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LibModule } from '@/lib/lib. module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminLocalStrategy, UserLocalStrategy } from './local.strategy';
import {
  AdminJwtStrategy,
  CompositeJwtStrategy,
  RefreshAdminJwtStrategy,
  RefreshUserJwtStrategy,
  UserJwtStrategy,
} from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    LibModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserLocalStrategy,
    AdminLocalStrategy,
    UserJwtStrategy,
    RefreshUserJwtStrategy,
    AdminJwtStrategy,
    RefreshAdminJwtStrategy,
    CompositeJwtStrategy,
    Logger,
  ],
})
export class AuthModule {}
