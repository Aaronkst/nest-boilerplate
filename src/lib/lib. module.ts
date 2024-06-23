import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UtilsService } from './utils.service';

@Module({
  imports: [],
  providers: [PrismaService, UtilsService],
  exports: [PrismaService, UtilsService],
})
export class LibModule {}
