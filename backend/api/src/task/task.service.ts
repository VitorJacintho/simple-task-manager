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

  async findAllByUser(nm_micro: string) {
    const tasks = await this.prisma.task.findMany({
      where: { nm_micro: nm_micro },
      orderBy: { createdAt: 'desc' },
    });

    const updatedTasks = tasks.map(task => {
      let elapsed_ms = task.elapsed_ms || 0;

      if (task.tp_status === 'S' && task.startedAt) {
        const now = new Date();
        elapsed_ms += now.getTime() - task.startedAt.getTime();
      }

      return {
        ...task,
        elapsed_ms,
      };
    });

    return updatedTasks;
  }



  async findOne(cd_task: string) {
    const task = await this.prisma.task.findUnique({
      where: { cd_task },
    });

    if (!task) return null;

    let elapsed_ms = task.elapsed_ms || 0;

    if (task.tp_status === 'S' && task.startedAt) {
      const now = new Date();
      elapsed_ms += now.getTime() - task.startedAt.getTime();
    }

    return {
      ...task,
      elapsed_ms,
    };
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

  async startTask(cd_task: string) {
  return this.prisma.task.update({
    where: { cd_task },
    data: {
      tp_status: 'S',
      startedAt: new Date(),
    },
  });
}

async pauseTask(cd_task: string) {
  const task = await this.prisma.task.findUnique({
    where: { cd_task },
  });

  if (!task) return null;

  let extraMs = 0;
  if (task.startedAt) {
    extraMs = new Date().getTime() - task.startedAt.getTime();
  }

  return this.prisma.task.update({
    where: { cd_task },
    data: {
      tp_status: 'P',
      elapsed_ms: (task.elapsed_ms || 0) + extraMs,
      startedAt: null,
    },
  });
}


}
