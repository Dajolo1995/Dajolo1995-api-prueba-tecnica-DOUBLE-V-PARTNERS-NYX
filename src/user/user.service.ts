import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { UpdateUserDto } from 'src/auth/dto/updateUser.dto';
import { ErrorService } from 'src/error/error.service';
import { isValidPassword } from 'src/utils/validatePassword';
import { generateRandomCode } from 'src/utils/generateCode';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly errorService: ErrorService,
  ) {}

  async createUser(data: CreateUserDto) {
    try {
      const email = data.email.toLowerCase();
      const nickname = data.nickname.toLowerCase();

      await this.validateUniqueFields(email, nickname);

      const passwordHash = await this.validateAndHashPassword(data.password);

      const user = await this.prisma.user.create({
        data: {
          ...data,
          email,
          nickname,
          password: passwordHash,
          code: generateRandomCode(6),
        },
      });

      const { password, ...safeUser } = user;
      return user;
    } catch (error) {
      this.errorService.handleError(
        'Error al crear usuario',
        'UserService: createUser',
        error,
      );
    }
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findOne(email?: string, nickname?: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { nickname }],
      },
    });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    try {
      await this.validateUniqueFields(data.email, data.nickname, id);

      const updateData = await this.buildUpdateData(data);

      return await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      this.errorService.handleError(
        'Error al actualizar usuario',
        'UserService: updateUser',
        error,
      );
    }
  }

  async getUser(id?: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          isActive: true,
          ...(id && {
            id: {
              not: id,
            },
          }),
        },
        select: {
          id: true, 
          nickname: true
        }
      });

      return users;
    } catch (error) {
      this.errorService.handleError(
        'Error al obtener usuario',
        'UserService: getUser',
        error,
      );
    }
  }

  private async validateUniqueFields(
    email?: string,
    nickname?: string,
    excludeUserId?: string,
  ) {
    if (!email && !nickname) return;

    const orConditions: any = [];

    if (email) {
      orConditions.push({ email });
    }

    if (nickname) {
      orConditions.push({ nickname });
    }

    const exists = await this.prisma.user.findFirst({
      where: {
        OR: orConditions,
        ...(excludeUserId && {
          NOT: { id: excludeUserId },
        }),
      },
    });

    if (!exists) return;

    if (email && exists.email === email) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    if (nickname && exists.nickname === nickname) {
      throw new ConflictException('El NickName ya está en uso');
    }
  }

  private async validateAndHashPassword(password: string): Promise<string> {
    if (!isValidPassword(password)) {
      throw new ConflictException(
        'La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales',
      );
    }

    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  private async buildUpdateData(data: UpdateUserDto) {
    const updateData: any = {};

    if (data.password) {
      updateData.password = await this.validateAndHashPassword(data.password);
    }

    if (data.email) updateData.email = data.email;
    if (data.nickname) updateData.nickname = data.nickname;
    if (data.name) updateData.name = data.name;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.phone) updateData.phone = data.phone;
    if (data.code) updateData.code = data.code;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return updateData;
  }
}
