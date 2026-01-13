import 'reflect-metadata';

jest.mock('./user.service', () => ({
  UserService: jest.fn().mockImplementation(() => ({
    getUser: jest.fn(),
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get(UserController);
    service = module.get(UserService) as jest.Mocked<UserService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getUsers → without excludeId', async () => {
    (service.getUser as jest.Mock).mockResolvedValue([
      { id: 'user-1' },
      { id: 'user-2' },
    ]);

    const result = await controller.getUsers();

    expect(service.getUser).toHaveBeenCalledWith(undefined);
    expect(result).toEqual([{ id: 'user-1' }, { id: 'user-2' }]);
  });

  it('getUsers → with excludeId', async () => {
    (service.getUser as jest.Mock).mockResolvedValue([{ id: 'user-2' }]);

    const result = await controller.getUsers('user-1');

    expect(service.getUser).toHaveBeenCalledWith('user-1');
    expect(result).toEqual([{ id: 'user-2' }]);
  });
});
