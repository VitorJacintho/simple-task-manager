import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.clients.findMany();  
  }

  async create(data) {
    return this.prisma.clients.create({ data });
  }

    async findOne(cd_client: string) {
    return this.prisma.clients.findUnique({ where: { cd_client } });
  }
}
