export enum Role {
  User = 'user',
  Admin = 'admin',
}

export type TokenPayload = {
  id: string;
  role: Role;
};

export type ListResponse<T> = {
  count: number;
  next?: number;
  data: T[];
};

export type SingleResponse<T> = {
  data: T;
};
