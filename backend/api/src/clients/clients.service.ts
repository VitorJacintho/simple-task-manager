import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.clients.findMany();  // Retorna todos os clientes
  }

  async create(data) {
    return this.prisma.clients.create({ data });
  }
}
