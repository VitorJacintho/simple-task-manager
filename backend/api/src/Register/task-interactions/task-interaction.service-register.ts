import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskInteractionRegisterService {
  constructor(private prisma: PrismaService) {}


  async create(data: Prisma.Task_Interactions_RegisterCreateInput) {
    return this.prisma.task_Interactions_Register.create({ data });
  }

  async findByTask(cd_task: string) {
    return this.prisma.task_Interactions_Register.findMany({
      where: { cd_task },
      orderBy: { vl_order: 'asc' },
    });
  }

}


