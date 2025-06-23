import { Prisma } from '@prisma/client';

export class User implements Prisma.UsersCreateInput {
  cd_user: string;
  nm_user: string;
  ds_email: string;
  ds_password: string;
  profile_picture?: string; // Foto de perfil opcional
  createdAt: Date;
  updatedAt: Date;
}
