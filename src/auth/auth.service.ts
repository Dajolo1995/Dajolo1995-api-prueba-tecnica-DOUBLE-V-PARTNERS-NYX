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
import { EmailService } from 'src/emails/email.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private errorService: ErrorService,
    private userService: UserService,
    private emailService: EmailService,
  ) {}

  async registerUser(data: CreateUserDto) {
    try {
      const user = await this.userService.createUser(data);

      await this.emailService.sendCode(user as User);

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

   const updateUser = await this.userService.updateUser(id, { isActive: true });

    return updateUser;
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

    if (users.isActive === false) {
      const userUpdate: User = (await this.userService.generateCode(
        users.id,
      )) as User;

      await this.emailService.sendCode(userUpdate as User);

      return {
        msg: 'Usuario no verificado, se ha enviado un nuevo código de verificación',
        users,
      };
    }

    return {
      msg: 'Login exitoso',
      users,
    };
  }
}
