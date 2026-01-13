import 'reflect-metadata';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    debt: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    debtParticipant: {
      findMany: jest.fn(),
      updateMany: jest.fn(),
    },
  })),
}));

jest.mock('src/error/error.service', () => ({
  ErrorService: jest.fn().mockImplementation(() => ({
    handleError: jest.fn(),
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DebtService, DebtStatus } from './debt.service';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorService } from 'src/error/error.service';
import { CreateDebtInput } from './dto/createDebt.dto';

describe('DebtService', () => {
  let service: DebtService;
  let prisma: PrismaService;
  let errorService: ErrorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DebtService, PrismaService, ErrorService],
    }).compile();

    service = module.get(DebtService);
    prisma = module.get(PrismaService);
    errorService = module.get(ErrorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createDebt → OK', async () => {
    const input: CreateDebtInput = {
      description: 'Deuda comida',
      totalAmount: 10000,
      createdById: 'user-id',
    };

    (prisma.debt.create as jest.Mock).mockResolvedValue({
      id: 'debt-id',
      ...input,
      status: DebtStatus.PENDING,
    });

    const result = await service.createDebt(input);

    expect(prisma.debt.create).toHaveBeenCalledWith({
      data: {
        description: input.description,
        totalAmount: input.totalAmount,
        createdById: input.createdById,
        status: DebtStatus.PENDING,
      },
    });

    expect(result?.status).toBe(DebtStatus.PENDING);
  });

  it('createDebt → totalAmount <= 0', async () => {
    await service.createDebt({
      description: 'Error',
      totalAmount: 0,
      createdById: 'user-id',
    });

    expect(errorService.handleError).toHaveBeenCalled();
  });

  it('listDebtsByUser → OK', async () => {
    (prisma.debt.findMany as jest.Mock).mockResolvedValue([{ id: 'debt-id' }]);

    const result = await service.listDebtsByUser('user-id');

    expect(prisma.debt.findMany).toHaveBeenCalled();
    expect(result).toEqual([{ id: 'debt-id' }]);
  });

  it('getDebtById → OK', async () => {
    (prisma.debt.findUnique as jest.Mock).mockResolvedValue({
      id: 'debt-id',
    });

    const result = await service.getDebtById('debt-id');

    expect(result.id).toBe('debt-id');
  });

  it('getDebtById → NOT FOUND', async () => {
    (prisma.debt.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.getDebtById('invalid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('markDebtAsPaid → OK', async () => {
    jest
      .spyOn(service, 'getDebtById')
      .mockResolvedValue({ status: DebtStatus.PENDING } as any);

    (prisma.debtParticipant.findMany as jest.Mock).mockResolvedValue([
      { id: 'p1' },
    ]);

    (prisma.debtParticipant.updateMany as jest.Mock).mockResolvedValue({
      count: 1,
    });

    (prisma.debt.update as jest.Mock).mockResolvedValue({
      id: 'debt-id',
      status: DebtStatus.PAID,
    });

    const result = await service.markDebtAsPaid('debt-id');

    expect(prisma.debt.update).toHaveBeenCalled();
    expect(result?.status).toBe(DebtStatus.PAID);
  });

  it('markDebtAsPaid → already PAID', async () => {
    jest
      .spyOn(service, 'getDebtById')
      .mockResolvedValue({ status: DebtStatus.PAID } as any);

    await service.markDebtAsPaid('debt-id');

    expect(errorService.handleError).toHaveBeenCalled();
  });

  it('updateDebt → OK', async () => {
    jest
      .spyOn(service, 'getDebtById')
      .mockResolvedValue({ status: DebtStatus.PENDING } as any);

    (prisma.debt.update as jest.Mock).mockResolvedValue({
      id: 'debt-id',
    });

    const result = await service.updateDebt('debt-id', {
      description: 'Nueva',
    });

    expect(prisma.debt.update).toHaveBeenCalled();
    expect(result?.id).toBe('debt-id');
  });

  it('deleteDebt → OK', async () => {
    jest
      .spyOn(service, 'getDebtById')
      .mockResolvedValue({ status: DebtStatus.PENDING } as any);

    (prisma.debt.delete as jest.Mock).mockResolvedValue({});

    const result = await service.deleteDebt('debt-id');

    expect(prisma.debt.delete).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  /* =========================
   * SUMMARY
   * ========================= */

  it('debtSummaryByUser → OK', async () => {
    (prisma.debt.findMany as jest.Mock).mockResolvedValue([
      { totalAmount: 1000, status: DebtStatus.PAID },
      { totalAmount: 2000, status: DebtStatus.PENDING },
    ]);

    const result = await service.debtSummaryByUser('user-id');

    expect(result).toEqual({
      totalPaid: 1000,
      totalPending: 2000,
    });
  });
});
