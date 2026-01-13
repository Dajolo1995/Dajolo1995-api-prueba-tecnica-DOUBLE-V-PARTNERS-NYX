import 'reflect-metadata';


jest.mock('src/user/user.entity', () => ({
  User: class User {},
}));

jest.mock('src/debt/debt.entity', () => ({
  Debt: class Debt {},
  DebtStatus: {
    PENDING: 'PENDING',
    PAID: 'PAID',
  },
}));

import { DebtParticipant } from './debt-participant.entity';
import { DebtStatus } from 'src/debt/debt.entity';

describe('DebtParticipant Entity', () => {
  it('should be defined', () => {
    expect(DebtParticipant).toBeDefined();
  });

  it('should create a valid instance', () => {
    const participant = new DebtParticipant();

    participant.id = 'participant-id';
    participant.userId = 'user-id';
    participant.debtId = 'debt-id';
    participant.amount = 5000;
    participant.status = DebtStatus.PENDING;
    participant.createdAt = new Date();
    participant.updatedAt = new Date();

    expect(participant).toBeInstanceOf(DebtParticipant);
    expect(participant.status).toBe(DebtStatus.PENDING);
    expect(participant.amount).toBe(5000);
  });

  describe('DebtStatus enum', () => {
    it('should allow PENDING', () => {
      expect(DebtStatus.PENDING).toBe('PENDING');
    });

    it('should allow PAID', () => {
      expect(DebtStatus.PAID).toBe('PAID');
    });

    it('should contain only valid values', () => {
      expect(Object.values(DebtStatus)).toEqual([
        'PENDING',
        'PAID',
      ]);
    });
  });
});
