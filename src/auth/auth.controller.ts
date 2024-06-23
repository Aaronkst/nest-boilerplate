import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '@/app.type';
import {
  AdminLocalAuthGuard,
  RefreshAdminJwtAuthGuard,
  RefreshUserJwtAuthGuard,
  UserLocalAuthGuard,
} from './strict.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(UserLocalAuthGuard)
  @Post('users/login')
  async userLogin(@Request() req) {
    return this.authService.login(req.user, Role.User);
  }
  @UseGuards(AdminLocalAuthGuard)
  @Post('admin/login')
  async adminLogin(@Request() req) {
    return this.authService.login(req.user, Role.Admin);
  }

  @UseGuards(RefreshUserJwtAuthGuard)
  @Post('users/refresh')
  async userRefresh(@Request() req) {
    return this.authService.login(req.user, Role.User);
  }
  @UseGuards(RefreshAdminJwtAuthGuard)
  @Post('admin/refresh')
  async adminRefresh(@Request() req) {
    return this.authService.login(req.user, Role.Admin);
  }
}
