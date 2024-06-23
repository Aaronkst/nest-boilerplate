import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SoftUserAuthGuard, SoftAdminAuthGuard } from './soft.guard';

// Local Guards
@Injectable()
export class UserLocalAuthGuard extends AuthGuard('user-local') {}

@Injectable()
export class AdminLocalAuthGuard extends AuthGuard('admin-local') {}

// User Jwt Guards
@Injectable()
export class UserJwtAuthGuard extends AuthGuard('user-jwt') {}

@Injectable()
export class SoftUserJwtAuthGuard extends SoftUserAuthGuard {}

@Injectable()
export class RefreshUserJwtAuthGuard extends AuthGuard('refresh-user-jwt') {}

// Admin Jwt Guards
@Injectable()
export class AdminJwtAuthGuard extends AuthGuard('admin-jwt') {}

@Injectable()
export class SoftAdminJwtAuthGuard extends SoftAdminAuthGuard {}

@Injectable()
export class RefreshAdminJwtAuthGuard extends AuthGuard('refresh-admin-jwt') {}

// Composite Guard
@Injectable()
export class CompositeJwtAuthGuard extends AuthGuard('composite-jwt') {}
