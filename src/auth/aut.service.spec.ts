

jest.mock('src/user/user.service', () => ({
  UserService: jest.fn().mockImplementation(() => ({
    createUser: jest.fn(),
    findById: jest.fn(),
    updateUser: jest.fn(),
    findOne: jest.fn(),
    generateCode: jest.fn(),
  })),
}));

jest.mock('src/emails/email.service', () => ({
  EmailService: jest.fn().mockImplementation(() => ({
    sendCode: jest.fn(),
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
import { EmailService } from 'src/emails/email.service';
import { ErrorService } from 'src/error/error.service';
import * as bcrypt from 'bcryptjs';


describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let emailService: jest.Mocked<EmailService>;
  let errorService: jest.Mocked<ErrorService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, EmailService, ErrorService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    emailService = module.get(EmailService);
    errorService = module.get(ErrorService);
  });

  afterEach(() => jest.clearAllMocks());


  it('should register user and send email', async () => {
    const dto = { email: 'test@mail.com' } as any;
    const user = { id: '1' };

    userService.createUser.mockResolvedValue(user as any);

    const result: any = await service.registerUser(dto);

    expect(userService.createUser).toHaveBeenCalledWith(dto);
    expect(emailService.sendCode).toHaveBeenCalledWith(user);
    expect(result.message).toContain('Usuario registrado con éxito');
  });

  it('should handle error when registerUser fails', async () => {
    const error = new Error('DB error');

    userService.createUser.mockRejectedValue(error);

    await service.registerUser({} as any);

    expect(errorService.handleError).toHaveBeenCalledWith(
      'Error al registrar usuario',
      'AuthService: registerUser',
      error,
    );
  });

  it('should throw NotFoundException if user does not exist', async () => {
    userService.findById.mockResolvedValue(null);

    await expect(service.validateUser('1', '1234')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ConflictException if code is invalid', async () => {
    userService.findById.mockResolvedValue({ code: '9999' } as any);

    await expect(service.validateUser('1', '1234')).rejects.toThrow(
      ConflictException,
    );
  });

  it('should activate user if code is valid', async () => {
    const user = { id: '1', code: '1234' };
    const updatedUser = { id: '1', isActive: true };

    userService.findById.mockResolvedValue(user as any);
    userService.updateUser.mockResolvedValue(updatedUser as any);

    const result = await service.validateUser('1', '1234');

    expect(userService.updateUser).toHaveBeenCalledWith('1', {
      isActive: true,
    });
    expect(result).toEqual(updatedUser);
  });

  it('should throw NotFoundException if user not found', async () => {
    userService.findOne.mockResolvedValue(null);

    await expect(service.login('user', 'pass')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException if password is invalid', async () => {
    userService.findOne.mockResolvedValue({ password: 'hash' } as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login('user', 'pass')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should resend verification code if user is inactive', async () => {
    const user = {
      id: '1',
      password: 'hash',
      isActive: false,
    };

    userService.findOne.mockResolvedValue(user as any);
    userService.generateCode.mockResolvedValue({ ...user, code: '1234' } as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.login('user', 'pass');

    expect(userService.generateCode).toHaveBeenCalledWith('1');
    expect(emailService.sendCode).toHaveBeenCalled();
    expect(result.msg).toContain('Usuario no verificado');
  });

  it('should login successfully if user is active', async () => {
    const user = {
      password: 'hash',
      isActive: true,
    };

    userService.findOne.mockResolvedValue(user as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.login('user', 'pass');

    expect(result.msg).toBe('Login exitoso');
  });
});
