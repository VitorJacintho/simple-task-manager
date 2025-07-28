import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { TaskInteractionModule } from './task-interactions/task-interaction.module';
import { ClientsModule } from './clients/clients.module';
import { SystemController } from './@system/system.controller';
import { TaskRegisterModule } from './Register/task/task-register.module';
import { TaskInteractionRegisterModule } from './Register/task-interactions/task-interaction-register.module';
import { UsersMicroModule } from './users-micro/users-micro.module';

@Module({
  imports: 
    [TaskModule, 
      TaskInteractionModule, 
      ClientsModule, 
      TaskRegisterModule, 
      TaskInteractionRegisterModule, 
      UsersMicroModule,

      PrismaModule
    ],  
  controllers: [AppController, SystemController],
  providers: [AppService],
})
export class AppModule {}
