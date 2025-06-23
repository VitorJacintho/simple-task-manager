// src/task/task.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateInput) {
    return this.prisma.task.create({ data });
  }

  async findAllByUser(cd_user: string) {
    return this.prisma.task.findMany({
      where: { cd_user },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(cd_task: string) {
    return this.prisma.task.findUnique({ where: { cd_task } });
  }

  async update(cd_task: string, data: Prisma.TaskUpdateInput) {
    return this.prisma.task.update({
      where: { cd_task },
      data,
    });
  }

  async delete(cd_task: string) {
    return this.prisma.task.delete({ where: { cd_task } });
  }


  async update_detail(cd_task: string, ds_task: string, tp_situation: string, nm_title: string, cd_client: string) {
  return this.prisma.task.update({
    where: { cd_task },
    data: {         
      ds_task,     
      tp_situation, 
      nm_title,
      cd_client,
    },
  });
  }

  async update_current_time(cd_task: string, elapsed_ms: number) {
  return this.prisma.task.update({
    where: { cd_task },
    data: {         
      elapsed_ms,
    },
  });
  }

}
