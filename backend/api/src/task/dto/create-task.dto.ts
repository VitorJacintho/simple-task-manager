import { IsString, IsOptional, IsBoolean, IsDateString, IsBase64 } from 'class-validator';

export class CreateTaskDto {
  nm_title: string;
  ds_task?: string;
  cd_user: string;
  goal_ms?: number;
  elapsed_ms?: number;
  tp_status: string;
  tp_situation?: string
  cd_client?: number;
}