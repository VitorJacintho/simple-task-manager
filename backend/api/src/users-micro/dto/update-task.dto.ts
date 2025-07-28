import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersMicroDto } from './create-task.dto';

export class UpdateUsersMicroDto extends PartialType(CreateUsersMicroDto) {}