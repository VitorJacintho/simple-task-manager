import { IsString, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  ds_email: string;

  @IsString()
  ds_password: string;
}
