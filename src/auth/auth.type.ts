import { Role } from '@/app.type';
import { Admin, User } from '@prisma/client';

export type AuthToken = {
  user: User | Admin;
  token: {
    access: {
      token: string;
      expiredAt: Date;
    };
    refresh: {
      token: string;
      expiredAt: Date;
    };
  };
};

export type AuthTokenPayload = {
  id: string;
  role: Role;
};

export type RefreshTokenPayload = {
  token: string;
  role: Role;
};
