import 'reflect-metadata';
import { Debt, DebtStatus } from './debt.entity';

describe('Debt Entity', () => {
  it('should be defined', () => {
    expect(Debt).toBeDefined();
  });

  it('should create a Debt instance', () => {
    const debt = new Debt();

    debt.id = 'debt-id';
    debt.description = 'Deuda almuerzo';
    debt.totalAmount = 20000;
    debt.createdById = 'user-id';
    debt.status = DebtStatus.PENDING;
    debt.createdAt = new Date();
    debt.updatedAt = new Date();

    expect(debt).toBeInstanceOf(Debt);
    expect(debt.id).toBe('debt-id');
    expect(debt.status).toBe(DebtStatus.PENDING);
  });

  describe('DebtStatus enum', () => {
    it('should have PENDING status', () => {
      expect(DebtStatus.PENDING).toBe('PENDING');
    });

    it('should have PAID status', () => {
      expect(DebtStatus.PAID).toBe('PAID');
    });

    it('should contain only valid values', () => {
      const values = Object.values(DebtStatus);

      expect(values).toEqual(['PENDING', 'PAID']);
    });
  });
});
