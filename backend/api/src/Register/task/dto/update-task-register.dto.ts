import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskRegisterDto } from './create-task-register.dto';

export class UpdateTaskDto extends PartialType(CreateTaskRegisterDto) {}