import { ListResponse, SingleResponse } from '@/app.type';
import { UtilsService } from '@/lib/utils.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto, FindUserDto, ListUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
    @Inject(Logger) private readonly logger = new Logger(UsersController.name),
  ) {}

  @Get('find')
  async findUser(@Query() query: FindUserDto): Promise<SingleResponse<User>> {
    try {
      const user = await this.usersService.user({
        id: query.id ?? null,
        email: query.email ?? null,
      });
      if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      return { data: user };
    } catch (e) {
      if (e instanceof HttpException) throw e;

      this.logger.error(e.stack);
      throw new HttpException(
        'Unexpected Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getUsers(@Query() query: ListUserDto): Promise<ListResponse<User>> {
    try {
      const skip = query.skip ? parseInt(query.skip) : 0;
      const take = query.take ? parseInt(query.take) : 20;

      const users = await this.usersService.users({
        skip,
        take,
        where: {
          email: query.email ?? undefined,
          name: query.name ?? undefined,
          active:
            query.active !== undefined ? query.active === 'true' : undefined,
        },
      });

      return { ...users, next: skip + take };
    } catch (e) {
      if (e instanceof HttpException) throw e;

      this.logger.error(e.stack);
      throw new HttpException(
        'Unexpected Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createUser(
    @Body() { password, ...payload }: CreateUserDto,
  ): Promise<SingleResponse<User>> {
    try {
      const _password = await this.utilsService.hashPassword(password);
      const user = await this.usersService.createUser({
        password: _password,
        ...payload,
      });
      return { data: user };
    } catch (e) {
      if (e instanceof HttpException) throw e;

      this.logger.error(e.stack);
      throw new HttpException(
        'Unexpected Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() { ...payload }: CreateUserDto,
  ): Promise<SingleResponse<User>> {
    try {
      const user = await this.usersService.updateUser({
        where: { id },
        data: {
          ...payload,
        },
      });
      return { data: user };
    } catch (e) {
      if (e instanceof HttpException) throw e;

      this.logger.error(e.stack);
      throw new HttpException(
        'Unexpected Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @Query() { hard }: { hard?: string },
  ): Promise<SingleResponse<User>> {
    try {
      let query: any;
      if (hard === 'true') query = this.usersService.deleteUser({ id });
      else query = this.usersService.softDeleteUser({ id });

      return await query;
    } catch (e) {
      if (e instanceof HttpException) throw e;

      this.logger.error(e.stack);
      throw new HttpException(
        'Unexpected Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
