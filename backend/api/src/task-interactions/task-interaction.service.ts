// src/task/task.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskInteractionService {
  constructor(private prisma: PrismaService) {}

  // async create(data: Prisma.Task_InteractionsCreateInput) {
  //   return this.prisma.task_Interactions.create({ data });
  // }
  async create(data: Prisma.Task_InteractionsCreateInput) {
    return this.prisma.task_Interactions.create({ data });
  }

  async findAllByTask(cd_task: string) {
    return this.prisma.task_Interactions.findMany({
      where: { cd_task },
      orderBy: { vl_order: 'desc' },
    });
  }


  async delete(cd_task_interaction: number) {
    return this.prisma.task_Interactions.delete({ where: { cd_task_interaction } });
  }



}


