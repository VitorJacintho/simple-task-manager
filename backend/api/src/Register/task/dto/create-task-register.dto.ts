import { IsString, IsOptional, IsBoolean, IsDateString, IsBase64 } from 'class-validator';

export class CreateTaskRegisterDto {
  cd_register: string;
  nm_title: string;
  ds_task?: string;
  nm_micro: string;
  goal_ms?: number;
  elapsed_ms?: number;
  tp_situation?: string
  cd_client?: number;
}