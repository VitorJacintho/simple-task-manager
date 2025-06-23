import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nm_user: string;

  @IsEmail()
  ds_email: string;

  @IsString()
  ds_password: string;

  @IsOptional() // A foto de perfil é opcional
  profile_picture?: string; // URL da foto de perfil
}
