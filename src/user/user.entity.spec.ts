import 'reflect-metadata';

jest.mock('src/debt/debt.entity', () => ({
  Debt: class Debt {},
}));

jest.mock('src/debtParticipant/debt-participant.entity', () => ({
  DebtParticipant: class DebtParticipant {},
}));

import { User } from './user.entity';

describe('User Entity', () => {
  it('should be defined', () => {
    expect(User).toBeDefined();
  });

  it('should create a valid instance', () => {
    const user = new User();

    user.id = 'user-id';
    user.email = 'test@test.com';
    user.password = 'password123';
    user.nickname = 'nick';
    user.name = 'John';
    user.lastName = 'Doe';
    user.phone = '123456789';
    user.isActive = true;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    expect(user).toBeInstanceOf(User);
    expect(user.email).toBe('test@test.com');
    expect(user.isActive).toBe(true);
  });

  it('should allow optional fields', () => {
    const user = new User();

    user.id = 'user-id';
    user.email = 'test@test.com';
    user.password = 'password123';
    user.nickname = 'nick';
    user.name = 'John';
    user.lastName = 'Doe';
    user.phone = '123456789';
    user.code = '123456';
    user.isActive = false;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    expect(user.code).toBe('123456');
    expect(user.isActive).toBe(false);
  });

  it('should allow relations arrays', () => {
    const user = new User();

    user.debtsCreated = [];
    user.debtParticipants = [];

    expect(Array.isArray(user.debtsCreated)).toBe(true);
    expect(Array.isArray(user.debtParticipants)).toBe(true);
  });
});
