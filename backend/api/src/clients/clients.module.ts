import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { PrismaModule } from '../prisma/prisma.module';  // Certifique-se de que PrismaModule está importado corretamente

@Module({
  imports: [PrismaModule],  // PrismaModule deve ser importado corretamente
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
