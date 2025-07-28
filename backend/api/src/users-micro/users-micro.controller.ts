import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersMicroService } from './users-micro.service';
import { Prisma } from '@prisma/client';

@Controller('users-micro')
export class UsersMicroController {
  constructor(private readonly usersMicroService: UsersMicroService) {}

  @Get()
  findAll() {
    return this.usersMicroService.findAll();
  }

  @Get('by-micro')
  findByMicro(@Query('nm_micro') nm_micro: string) {
    return this.usersMicroService.findByMicro(nm_micro);
  }

  @Post()
  create(@Body() data: Prisma.Users_MicroCreateInput) {
    return this.usersMicroService.createUserMicro(data);
  }
}
