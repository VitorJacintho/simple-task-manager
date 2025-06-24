import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')  // A rota será /clients
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async createClient(@Body() body: { nm_client: string }) {
    const { nm_client } = body;
    return this.clientsService.create({ nm_client: nm_client });
  }

  @Get()  // Rota para o GET /clients
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':cd_client')
  findOne(@Param('cd_client') cd_client: string) {
    return this.clientsService.findOne(cd_client);
  }
}
