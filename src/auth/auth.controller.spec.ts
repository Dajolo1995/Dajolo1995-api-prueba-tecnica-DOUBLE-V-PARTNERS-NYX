import 'reflect-metadata';


jest.mock('./auth.service', () => {
  return {
    AuthService: jest.fn().mockImplementation(() => ({
      registerUser: jest.fn(),
      validateUser: jest.fn(),
      login: jest.fn(),
    })),
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService], 
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call registerUser with dto', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        nickname: 'nick',
        name: 'Daniel',
        lastName: 'Lobo',
        phone: '+573001234567',
      };

      const result = { id: 'user-id' };
      service.registerUser.mockResolvedValue(result as any);

      const response = await controller.register(dto);

      expect(service.registerUser).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('validate', () => {
    it('should call validateUser with id and code', async () => {
      const body = { id: 'user-id', code: '123456' };
      const result = { validated: true };

      service.validateUser.mockResolvedValue(result as any);

      const response = await controller.validate(body);

      expect(service.validateUser).toHaveBeenCalledWith(body.id, body.code);
      expect(response).toEqual(result);
    });
  });

  describe('login', () => {
    it('should call login with user and password', async () => {
      const body = { user: 'test@example.com', password: 'password123' };
      const result = { accessToken: 'jwt-token' };

      service.login.mockResolvedValue(result as any);

      const response = await controller.login(body);

      expect(service.login).toHaveBeenCalledWith(body.user, body.password);
      expect(response).toEqual(result);
    });
  });
});
