import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersMicroService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users_Micro.findMany({
      orderBy: { nm_micro: 'desc' },
    });
  }

  async findByMicro(nm_micro: string) {
  return this.prisma.users_Micro.findFirst({
    where: { nm_micro },
  });
}

async createUserMicro(data: Prisma.Users_MicroCreateInput) {
  return this.prisma.users_Micro.create({
    data,
  });
}

}
