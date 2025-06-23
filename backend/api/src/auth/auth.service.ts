import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { ds_email, ds_password, nm_user, } = createUserDto;

    // Verifica se o usuário já existe
    const existingUser = await this.prisma.users.findUnique({ where: { ds_email } });
    if (existingUser) throw new Error('Usuário já existe');

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(ds_password, 10);

    // Cria o usuário
    const users = await this.prisma.users.create({
      data: {
        ds_email,
        nm_user,
        ds_password: hashedPassword,
        profile_picture: createUserDto.profile_picture || null, // Foto de perfil opcional
      },
    });

    return { message: 'Usuário criado com sucesso' };
  }

  async login(loginUserDto: LoginUserDto) {
    const { ds_email, ds_password } = loginUserDto;

    // Verifica se o usuário existe
    const users = await this.prisma.users.findUnique({ where: { ds_email } });
    if (!users) throw new Error('Usuário não encontrado');

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(ds_password, users.ds_password);
    if (!isMatch) throw new Error('Senha incorreta');

    // Gera o token JWT
    const token = jwt.sign({ userId: users.cd_user }, 'your_jwt_secret_key', { expiresIn: '1h' });

    return { token };
  }
}
