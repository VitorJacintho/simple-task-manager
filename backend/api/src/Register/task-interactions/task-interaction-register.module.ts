import { Module } from '@nestjs/common';
import { TaskInteractionRegisterService } from './task-interaction.service-register';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TaskInteractionRegisterController } from './task-interaction-register.controller';

@Module({
  imports: [PrismaModule],
  controllers: [TaskInteractionRegisterController],
  providers: [TaskInteractionRegisterService],
})
export class TaskInteractionRegisterModule {}
