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
import { TaskService } from './task.service';
import { Prisma } from '@prisma/client';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() data: Prisma.TaskCreateInput) {
    return this.taskService.create(data);
  }

  @Get()
  findAll(@Query('cd_user') cd_user: string) {
    return this.taskService.findAllByUser(cd_user);
  }

  @Get(':cd_task')
  findOne(@Param('cd_task') cd_task: string) {
    return this.taskService.findOne(cd_task);
  }

  @Patch(':cd_task')
  update(@Param('cd_task') cd_task: string, @Body() data: Prisma.TaskUpdateInput) {
    return this.taskService.update(cd_task, data );
  }
  

  @Delete(':cd_task')
  remove(@Param('cd_task') cd_task: string) {
    return this.taskService.delete(cd_task);
  }

  
  @Patch(':cd_task') // Rota para atualização detalhada
  async updateDetail(
    @Param('cd_task') cd_task: string,
    @Body() { ds_task, tp_situation, nm_title, cd_client }: { ds_task: string, tp_situation: string, nm_title: string, cd_client: string }
  ) {
    return this.taskService.update_detail(cd_task, ds_task, tp_situation, nm_title, cd_client);
  }

  @Patch(':cd_task') // Rota para atualização detalhada
  async updateCurrentTime(
    @Param('cd_task') cd_task: string,
    @Body() { elapsed_ms }: { elapsed_ms: number }
  ) {
    return this.taskService.update_current_time(cd_task, elapsed_ms);
  }


}
