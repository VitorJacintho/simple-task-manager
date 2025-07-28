import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaskRegisterService } from './task-register.service';


@Controller('tasks-register')
export class TaskRegisterController {
  constructor(private readonly taskRegisterService: TaskRegisterService) {}

  @Post(':id')
  registerFromTask(@Param('id') id: string) {
    return this.taskRegisterService.registerFromTask(id);
  }

 @Get()
  findAll(@Query('nm_micro') nm_micro?: string) {
    if (nm_micro) {
      return this.taskRegisterService.findAllByUser(nm_micro);
    }
    return this.taskRegisterService.findAll();
  }

  @Post(':id/recover')
  recoverTask(@Param('id') id: string) {
    return this.taskRegisterService.recoverTask(id);
  }

  @Get('pending')
  findPendingByUser(@Query('nm_micro') nm_micro: string) {
    return this.taskRegisterService.findPendingByUser(nm_micro);
  }


}
