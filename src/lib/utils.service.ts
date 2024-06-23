import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UtilsService {
  async hashPassword(raw: string): Promise<string> {
    return await hash(raw, 10);
  }

  async checkPassword(raw: string, hashed: string): Promise<boolean> {
    return await compare(raw, hashed);
  }
}
