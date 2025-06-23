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
import { Prisma } from '@prisma/client';
import { TaskInteractionService } from './task-interaction.service';

@Controller('tasks-interactions')
export class TaskInteractionController {
  constructor(private readonly taskInteractionService: TaskInteractionService) {}

  // @Post()
  // create(@Body() data: Prisma.Task_InteractionsCreateInput) {
  //   return this.taskInteractionService.create(data);
  // }
  @Post(':cd_task/interactions')
  async createInteraction(
    @Param('cd_task') cd_task: string,
    @Body() body: { ds_interaction: string; tm_elapsed: number; vl_order: number; },
  ) {
    const { ds_interaction, tm_elapsed, vl_order } = body;

    return this.taskInteractionService.create({
      ds_interaction: ds_interaction,
      tm_elapsed,
      vl_order,
      task: {
        connect: {
          cd_task,
        },
      },
    });
  }

  @Get()
  findAll(@Query('cd_task') cd_task: string) {
    return this.taskInteractionService.findAllByTask(cd_task);
  }
  

  @Delete(':cd_task_interaction')
  remove(@Param('cd_task_interaction') cd_task_interaction: number) {
    return this.taskInteractionService.delete(cd_task_interaction);
  }


    
  // @Patch(':cd_task') // Rota para atualização detalhada
  // async updateDetail(
  //   @Param('cd_task') cd_task: string,
  //   @Body() { ds_task, tp_situation }: { ds_task: string, tp_situation: string }
  // ) {
  //   return this.taskService.update_detail(cd_task, ds_task, tp_situation);
  // }


}
