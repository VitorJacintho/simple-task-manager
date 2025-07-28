// src/task/task.controller.ts
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
import { TaskInteractionRegisterService } from './task-interaction.service-register';
import { Prisma } from '@prisma/client';


@Controller('tasks-interactions-register')
export class TaskInteractionRegisterController {
  constructor(private readonly taskInteractionRegisterService: TaskInteractionRegisterService) {}

  @Post()
  create(@Body() data: Prisma.Task_Interactions_RegisterCreateInput) {
    return this.taskInteractionRegisterService.create(data);
  }


  @Get()
  findAll(@Query('cd_task') cd_task: string) {
    return this.taskInteractionRegisterService.findByTask(cd_task);
  }


}
