import 'reflect-metadata';

jest.mock('src/user/user.service', () => ({
  UserService: jest.fn().mockImplementation(() => ({
    createUser: jest.fn(),
    findById: jest.fn(),
    updateUser: jest.fn(),
    findOne: jest.fn(),
  })),
}));

jest.mock('src/error/error.service', () => ({
  ErrorService: jest.fn().mockImplementation(() => ({
    handleError: jest.fn(),
  })),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { ErrorService } from 'src/error/error.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/createUser.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let errorService: jest.Mocked<ErrorService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, ErrorService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    errorService = module.get(ErrorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should create user and return success message', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        nickname: 'nick',
        name: 'Daniel',
        lastName: 'Lobo',
        phone: '+573001234567',
      };

      const createdUser = { id: 'user-id' };
      userService.createUser.mockResolvedValue(createdUser as any);

      const result = await service.registerUser(dto);

      expect(userService.createUser).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message:
          'Usuario registrado con éxito, por favor revise su correo electronico (puede que se le haya enviado a spam) para que verifique su cuenta ',
        user: createdUser,
      });
    });

    it('should call errorService.handleError when createUser fails', async () => {
      const error = new Error('DB error');
      userService.createUser.mockRejectedValue(error);

      await service.registerUser({} as CreateUserDto);

      expect(errorService.handleError).toHaveBeenCalledWith(
        'Error al registrar usuario',
        'AuthService: registerUser',
        error,
      );
    });
  });

  describe('validateUser', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      userService.findById.mockResolvedValue(null);

      await expect(service.validateUser('id', 'code')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if code does not match', async () => {
      userService.findById.mockResolvedValue({
        id: 'id',
        code: '1234',
      } as any);

      await expect(service.validateUser('id', '9999')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should activate user if code is valid', async () => {
      const user = { id: 'id', code: '1234' };

      userService.findById.mockResolvedValue(user as any);

      const result = await service.validateUser('id', '1234');

      expect(userService.updateUser).toHaveBeenCalledWith('id', {
        isActive: true,
      });
      expect(result).toEqual(user);
    });
  });

  describe('login', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      userService.findOne.mockResolvedValue(null);

      await expect(service.login('user', 'pass')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if password does not match', async () => {
      userService.findOne.mockResolvedValue({
        password: 'hashed',
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('user', 'wrong')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should login successfully', async () => {
      const user = { id: 'user-id', password: 'hashed' };

      userService.findOne.mockResolvedValue(user as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('user', 'password123');

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', user.password);
      expect(result).toEqual({
        msg: 'Login exitoso',
        users: user,
      });
    });
  });
});
