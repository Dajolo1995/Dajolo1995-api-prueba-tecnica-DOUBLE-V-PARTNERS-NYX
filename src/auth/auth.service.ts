import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorService } from 'src/error/error.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private errorService: ErrorService,
    private userService: UserService,
  ) {}

  async registerUser(data: CreateUserDto) {
    try {
      const user = await this.userService.createUser(data);

      return {
        message:
          'Usuario registrado con éxito, por favor revise su correo electronico (puede que se le haya enviado a spam) para que verifique su cuenta ',
        user,
      };
    } catch (error) {
      this.errorService.handleError(
        'Error al registrar usuario',
        'AuthService: registerUser',
        error,
      );
    }
  }

  async validateUser(id: string, code: string) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.code !== code) {
      throw new ConflictException('Código de verificación inválido');
    }

    await this.userService.updateUser(id, { isActive: true });

    return user;
  }

  async login(user: string, password: string) {
    const users = await this.userService.findOne(user, user);

    if (!users) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(password, users.password);

    if (!isMatch) {
      throw new BadRequestException('Contraseña incorrecta');
    }

    return {
      msg: 'Login exitoso',
      users
    };
  }
}
