import 'reflect-metadata';


jest.mock('./debt.service', () => {
  return {
    DebtService: jest.fn().mockImplementation(() => ({
      createDebt: jest.fn(),
      listDebtsByUser: jest.fn(),
      getDebtById: jest.fn(),
      markDebtAsPaid: jest.fn(),
      updateDebt: jest.fn(),
      deleteDebt: jest.fn(),
      debtSummaryByUser: jest.fn(),
    })),
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { DebtController } from './debt.controller';
import { DebtService } from './debt.service';
import { CreateDebtInput } from './dto/createDebt.dto';

describe('DebtController', () => {
  let controller: DebtController;
  let service: jest.Mocked<DebtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebtController],
      providers: [DebtService],
    }).compile();

    controller = module.get<DebtController>(DebtController);
    service = module.get(DebtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDebt', () => {
    it('should create debt and return DEBT_CREATED message', async () => {
      const input: CreateDebtInput = {
        description: 'Deuda almuerzo',
        totalAmount: 15000,
        createdById: 'user-id',
      };

      service.createDebt.mockResolvedValue(undefined as any);

      const result = await controller.createDebt(input);

      expect(service.createDebt).toHaveBeenCalledWith(input);
      expect(result).toEqual({ message: 'DEBT_CREATED' });
    });
  });

  describe('listDebtsByUser', () => {
    it('should return debts by userId', async () => {
      const debts = [{ id: 'debt-1' }];

      service.listDebtsByUser.mockResolvedValue(debts as any);

      const result = await controller.listDebtsByUser('user-id');

      expect(service.listDebtsByUser).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(debts);
    });
  });

  describe('getDebtById', () => {
    it('should return debt by debtId', async () => {
      const debt = { id: 'debt-1' };

      service.getDebtById.mockResolvedValue(debt as any);

      const result = await controller.getDebtById('debt-1');

      expect(service.getDebtById).toHaveBeenCalledWith('debt-1');
      expect(result).toEqual(debt);
    });
  });

  describe('markDebtAsPaid', () => {
    it('should mark debt as paid and return DEBT_PAID', async () => {
      service.markDebtAsPaid.mockResolvedValue(undefined as any);

      const result = await controller.markDebtAsPaid('debt-1');

      expect(service.markDebtAsPaid).toHaveBeenCalledWith('debt-1');
      expect(result).toEqual({ message: 'DEBT_PAID' });
    });
  });

  describe('updateDebt', () => {
    it('should update debt and return DEBT_UPDATED', async () => {
      const payload = { description: 'Nueva descripción' };

      service.updateDebt.mockResolvedValue(undefined as any);

      const result = await controller.updateDebt('debt-1', payload);

      expect(service.updateDebt).toHaveBeenCalledWith('debt-1', payload);
      expect(result).toEqual({ message: 'DEBT_UPDATED' });
    });
  });

  describe('deleteDebt', () => {
    it('should delete debt', async () => {
      const response = { deleted: true };

      service.deleteDebt.mockResolvedValue(response as any);

      const result = await controller.deleteDebt('debt-1');

      expect(service.deleteDebt).toHaveBeenCalledWith('debt-1');
      expect(result).toEqual(response);
    });
  });

  describe('debtSummaryByUser', () => {
    it('should return debt summary by user', async () => {
      const summary = { total: 50000, paid: 20000 };

      service.debtSummaryByUser.mockResolvedValue(summary as any);

      const result = await controller.debtSummaryByUser('user-id');

      expect(service.debtSummaryByUser).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(summary);
    });
  });
});
