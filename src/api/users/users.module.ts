import { Logger, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LibModule } from '@/lib/lib.module';

@Module({
  imports: [LibModule],
  controllers: [UsersController],
  providers: [UsersService, Logger],
})
export class UsersModule {}
