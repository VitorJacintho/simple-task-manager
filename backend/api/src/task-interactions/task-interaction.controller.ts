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


}
