import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskInteractionRegisterDto } from './create-task-interactions-register.dto';

export class UpdateTaskInteractionRegisterDto extends PartialType(CreateTaskInteractionRegisterDto) {}
