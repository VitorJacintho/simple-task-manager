import { IsString, IsOptional, IsBoolean, IsDateString, IsBase64 } from 'class-validator';

export class CreateTaskInteractionDto {
  cd_task: string;
  ds_interaction: string;
  cd_client: number;
  tm_elapsed: number;
  vl_order: number;
}
