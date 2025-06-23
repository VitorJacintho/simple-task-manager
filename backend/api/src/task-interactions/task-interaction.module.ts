import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module'; // <--- MUITO IMPORTANTE
import { TaskInteractionController } from './task-interaction.controller';
import { TaskInteractionService } from './task-interaction.service';

@Module({
  imports: [PrismaModule],
  controllers: [TaskInteractionController],
  providers: [TaskInteractionService],
})
export class TaskInteractionModule {}
