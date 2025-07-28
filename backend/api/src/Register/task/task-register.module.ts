import { Module } from '@nestjs/common';
import { TaskRegisterController } from './task-register.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TaskRegisterService } from './task-register.service';

@Module({
  imports: [PrismaModule],
  controllers: [TaskRegisterController],
  providers: [TaskRegisterService],
})
export class TaskRegisterModule {}
