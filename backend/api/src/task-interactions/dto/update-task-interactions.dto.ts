import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskInteractionDto } from './create-task-interactions.dto';

export class UpdateTaskInteractionDto extends PartialType(CreateTaskInteractionDto) {}
