import 'reflect-metadata';

/**
 * 🔥 Mock del DebtService
 * Evita Prisma / DB
 */
jest.mock('./debt.service', () => ({
  DebtService: jest.fn().mockImplementation(() => ({
    createDebt: jest.fn(),
    listDebtsByUser: jest.fn(),
    getDebtById: jest.fn(),
    markDebtAsPaid: jest.fn(),
    updateDebt: jest.fn(),
    deleteDebt: jest.fn(),
    debtSummaryByUser: jest.fn(),
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { DebtResolver } from './debt.resolver';
import { DebtService } from './debt.service';
import { CreateDebtInput } from './dto/createDebt.dto';

describe('DebtResolver', () => {
  let resolver: DebtResolver;
  let service: jest.Mocked<DebtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DebtResolver, DebtService],
    }).compile();

    resolver = module.get<DebtResolver>(DebtResolver);
    service = module.get(DebtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDebt', () => {
    it('should create debt and return DEBT_CREATED', async () => {
      const input: CreateDebtInput = {
        description: 'Deuda almuerzo',
        totalAmount: 10000,
        createdById: 'user-id',
      };

      service.createDebt.mockResolvedValue(undefined as any);

      const result = await resolver.createDebt(input);

      expect(service.createDebt).toHaveBeenCalledWith(input);
      expect(result).toBe('DEBT_CREATED');
    });
  });

  describe('markDebtAsPaid', () => {
    it('should mark debt as paid and return DEBT_PAID', async () => {
      service.markDebtAsPaid.mockResolvedValue(undefined as any);

      const result = await resolver.markDebtAsPaid('debt-id');

      expect(service.markDebtAsPaid).toHaveBeenCalledWith('debt-id');
      expect(result).toBe('DEBT_PAID');
    });
  });

  describe('updateDebt', () => {
    it('should update debt and return DEBT_UPDATED', async () => {
      service.updateDebt.mockResolvedValue(undefined as any);

      const result = await resolver.updateDebt(
        'debt-id',
        'Nueva descripción',
        20000,
      );

      expect(service.updateDebt).toHaveBeenCalledWith('debt-id', {
        description: 'Nueva descripción',
        totalAmount: 20000,
      });
      expect(result).toBe('DEBT_UPDATED');
    });

    it('should update debt with partial data', async () => {
      service.updateDebt.mockResolvedValue(undefined as any);

      await resolver.updateDebt('debt-id', undefined, 5000);

      expect(service.updateDebt).toHaveBeenCalledWith('debt-id', {
        description: undefined,
        totalAmount: 5000,
      });
    });
  });

  describe('deleteDebt', () => {
    it('should delete debt and return boolean', async () => {
      service.deleteDebt.mockResolvedValue(true as any);

      const result = await resolver.deleteDebt('debt-id');

      expect(service.deleteDebt).toHaveBeenCalledWith('debt-id');
      expect(result).toBe(true);
    });
  });

  describe('listDebtsByUser', () => {
    it('should call service and return static response', async () => {
      service.listDebtsByUser.mockResolvedValue([{ id: 'debt-1' }] as any);

      const result = await resolver.listDebtsByUser('user-id');

      expect(service.listDebtsByUser).toHaveBeenCalledWith('user-id');
      expect(result).toBe('Hola');
    });
  });

  describe('getDebtById', () => {
    it('should return debt id', async () => {
      service.getDebtById.mockResolvedValue({ id: 'debt-id' } as any);

      const result = await resolver.getDebtById('debt-id');

      expect(service.getDebtById).toHaveBeenCalledWith('debt-id');
      expect(result).toBe('debt-id');
    });
  });

  describe('debtSummaryByUser', () => {
    it('should return stringified summary', async () => {
      const summary = { total: 50000, paid: 20000 };

      service.debtSummaryByUser.mockResolvedValue(summary as any);

      const result = await resolver.debtSummaryByUser('user-id');

      expect(service.debtSummaryByUser).toHaveBeenCalledWith('user-id');
      expect(result).toBe(JSON.stringify(summary));
    });
  });
});
