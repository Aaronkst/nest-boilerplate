import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UtilsService } from './utils.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly utilsService: UtilsService) {
    super();
  }
  async onModuleInit() {
    await this.$connect();

    const _count = await this.admin.count();

    if (_count === 0) {
      await this.admin.create({
        data: {
          name: 'Super User',
          email: process.env.SUPER_ADMIN_EMAIL,
          auth: {
            create: {
              password: await this.utilsService.hashPassword(
                process.env.SUPER_ADMIN_PASSWORD,
              ),
            },
          },
        },
      });
    }
  }
}
