import { IsString, IsOptional, IsBoolean, IsDateString, IsBase64 } from 'class-validator';

export class CreateUsersMicroDto {
  nm_user: string;
  nm_micro: string;
}