import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { TaskInteractionModule } from './task-interactions/task-interaction.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [TaskModule, TaskInteractionModule, ClientsModule, PrismaModule],  // Certifique-se de que ClientsModule está importado
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
