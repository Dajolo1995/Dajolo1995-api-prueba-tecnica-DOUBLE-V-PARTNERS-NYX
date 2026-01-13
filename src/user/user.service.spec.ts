import 'reflect-metadata';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

jest.mock('src/error/error.service', () => ({
  ErrorService: jest.fn().mockImplementation(() => ({
    handleError: jest.fn(),
  })),
}));

jest.mock('src/utils/validatePassword', () => ({
  isValidPassword: jest.fn(),
}));

jest.mock('src/utils/generateCode', () => ({
  generateRandomCode: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorService } from 'src/error/error.service';
import { isValidPassword } from 'src/utils/validatePassword';
import { generateRandomCode } from 'src/utils/generateCode';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  let errorService: ErrorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService, ErrorService],
    }).compile();

    service = module.get(UserService);
    prisma = module.get(PrismaService);
    errorService = module.get(ErrorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createUser → OK', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (isValidPassword as jest.Mock).mockReturnValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (generateRandomCode as jest.Mock).mockReturnValue('123456');

    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-id',
      email: 'test@test.com',
      nickname: 'nick',
      password: 'hashed-password',
    });

    const dto: CreateUserDto = {
      email: 'TEST@TEST.COM',
      password: 'Strong@123',
      nickname: 'Nick',
      name: 'John',
      lastName: 'Doe',
      phone: '123456',
    };

    const result = await service.createUser(dto);

    expect(prisma.user.create).toHaveBeenCalled();
    expect(result?.email).toBe('test@test.com');
  });

  it('createUser → duplicated email', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      email: 'test@test.com',
    });

    await service.createUser({
      email: 'test@test.com',
      password: 'Strong@123',
      nickname: 'nick',
      name: 'John',
      lastName: 'Doe',
      phone: '123',
    });

    expect(errorService.handleError).toHaveBeenCalled();
  });

  it('createUser → invalid password', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (isValidPassword as jest.Mock).mockReturnValue(false);

    await service.createUser({
      email: 'test@test.com',
      password: 'weak',
      nickname: 'nick',
      name: 'John',
      lastName: 'Doe',
      phone: '123',
    });

    expect(errorService.handleError).toHaveBeenCalled();
  });

  it('findById → OK', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-id',
    });

    const result = await service.findById('user-id');

    expect(result).toEqual({ id: 'user-id' });
  });

  it('findOne → OK', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: 'user-id',
    });

    const result = await service.findOne('test@test.com', undefined);

    expect(result).toEqual({ id: 'user-id' });
  });

  it('updateUser → OK with password', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (isValidPassword as jest.Mock).mockReturnValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

    (prisma.user.update as jest.Mock).mockResolvedValue({
      id: 'user-id',
    });

    const result = await service.updateUser('user-id', {
      password: 'Strong@123',
      name: 'New',
    });

    expect(prisma.user.update).toHaveBeenCalled();
    expect(result).toEqual({ id: 'user-id' });
  });

  it('updateUser → duplicated nickname', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      nickname: 'nick',
    });

    await service.updateUser('user-id', {
      nickname: 'nick',
    });

    expect(errorService.handleError).toHaveBeenCalled();
  });

  it('getUser → without excludeId', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([
      { id: 'u1', nickname: 'n1' },
    ]);

    const result = await service.getUser();

    expect(result).toEqual([{ id: 'u1', nickname: 'n1' }]);
  });

  it('getUser → with excludeId', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([
      { id: 'u2', nickname: 'n2' },
    ]);

    const result = await service.getUser('u1');

    expect(result).toEqual([{ id: 'u2', nickname: 'n2' }]);
  });

  it('getUser → error', async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('fail'));

    await service.getUser();

    expect(errorService.handleError).toHaveBeenCalled();
  });

  it('validateAndHashPassword → throws ConflictException', async () => {
    (isValidPassword as jest.Mock).mockReturnValue(false);

    try {
      await service['validateAndHashPassword']('weak');
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
    }
  });
});
