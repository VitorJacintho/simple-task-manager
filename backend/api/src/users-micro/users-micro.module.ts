import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersMicroController } from './users-micro.controller';
import { UsersMicroService } from './users-micro.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersMicroController],
  providers: [UsersMicroService],
})
export class UsersMicroModule {}
