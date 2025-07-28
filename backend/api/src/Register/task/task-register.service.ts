import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskRegisterService {
  constructor(private prisma: PrismaService) {}

  async registerFromTask(cd_task: string) {
    const task = await this.prisma.task.findUnique({
      where: { cd_task },
      include: {
        Task_Interactions: true,
      },
    });

    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    await this.prisma.task_Register.create({
      data: {
        cd_register: task.cd_task,
        cd_task: task.cd_task,
        nm_title: task.nm_title,
        ds_task: task.ds_task ?? '',
        tp_situation: task.tp_situation ?? 'I',
        nm_micro: task.nm_micro.toUpperCase(),
        elapsed_ms: task.elapsed_ms,
        goal_ms: task.goal_ms,
        tp_status: task.tp_status,
        cd_client: task.cd_client,
        createdAt: task.createdAt,
      },
    });

    for (const i of task.Task_Interactions) {
      await this.prisma.task_Interactions_Register.create({
        data: {
          cd_register: `${i.cd_task_interaction}-${task.cd_task}`, 
          cd_task_interaction: i.cd_task_interaction,
          cd_task: i.cd_task,
          ds_interaction: i.ds_interaction,
          tm_elapsed: i.tm_elapsed,
          vl_order: i.vl_order,
        },
      });
    }

    await this.prisma.task_Interactions.deleteMany({
      where: { cd_task },
    });

    await this.prisma.task.delete({
      where: { cd_task },
    });

    return { success: true, message: 'Tarefa registrada com sucesso.' };
  }

  async findAll() {
    return this.prisma.task_Register.findMany({
    });
  }

  async findAllasks() {
    return this.prisma.task_Register.findMany({
    });
  }

async findAllByUser(nm_micro: string) {
    return this.prisma.task_Register.findMany({
      where: { nm_micro },
      orderBy: { createdAt: 'desc' },
    });
  }

  async recoverTask(cd_task: string) {
  const registeredTask = await this.prisma.task_Register.findUnique({
    where: { cd_register: cd_task },
  });

    if (!registeredTask) {
      throw new Error('Tarefa registrada não encontrada');
    }

    await this.prisma.task.create({
      data: {
        cd_task: registeredTask.cd_task,
        nm_title: registeredTask.nm_title,
        ds_task: registeredTask.ds_task,
        tp_situation: registeredTask.tp_situation,
        nm_micro: registeredTask.nm_micro,
        elapsed_ms: registeredTask.elapsed_ms,
        goal_ms: registeredTask.goal_ms,
        tp_status: registeredTask.tp_status,
        cd_client: registeredTask.cd_client,
        createdAt: registeredTask.createdAt,
      },
    });

    const interactions = await this.prisma.task_Interactions_Register.findMany({
      where: { cd_task },
    });

    for (const i of interactions) {
      await this.prisma.task_Interactions.create({
        data: {
          cd_task: i.cd_task,
          ds_interaction: i.ds_interaction,
          tm_elapsed: i.tm_elapsed,
          vl_order: i.vl_order,
        },
      });
    }

    await this.prisma.task_Interactions_Register.deleteMany({
      where: { cd_task },
    });

    await this.prisma.task_Register.delete({
      where: { cd_register: cd_task },
    });

    return { success: true, message: 'Tarefa recuperada com sucesso.' };
  }
  

  async findPendingByUser(nm_micro: string) {
    return this.prisma.task_Register.findMany({
      where: {
        nm_micro: nm_micro,
        tp_situation: 'P',
      },
      orderBy: { createdAt: 'desc' },
    });
  }


}
