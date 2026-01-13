import 'reflect-metadata';


jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    debt: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    debtParticipant: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

jest.mock('../error/error.service', () => ({
  ErrorService: jest.fn().mockImplementation(() => ({
    handleError: jest.fn(),
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import {
  DebtParticipantService,
  DebtStatus,
} from './debtParticipant.service';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorService } from '../error/error.service';

describe('DebtParticipantService', () => {
  let service: DebtParticipantService;
  let prisma: PrismaService;
  let errorService: ErrorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DebtParticipantService,
        PrismaService,
        ErrorService,
      ],
    }).compile();

    service = module.get(DebtParticipantService);
    prisma = module.get(PrismaService);
    errorService = module.get(ErrorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('addParticipant → amount <= 0', async () => {
    await service.addParticipant('debt-id', 'user-id', 0);

    expect(errorService.handleError).toHaveBeenCalled();
  });

  it('addParticipant → debt not found', async () => {
    (prisma.debt.findUnique as jest.Mock).mockResolvedValue(null);

    await service.addParticipant('debt-id', 'user-id', 100);

    expect(errorService.handleError).toHaveBeenCalled();
  });

  it('addParticipant → debt already PAID', async () => {
    (prisma.debt.findUnique as jest.Mock).mockResolvedValue({
      status: DebtStatus.PAID,
    });

    await service.addParticipant('debt-id', 'user-id', 100);

    expect(errorService.handleError).toHaveBeenCalled();
  });

  it('addParticipant → duplicated participant', async () => {
    (prisma.debt.findUnique as jest.Mock).mockResolvedValue({
      status: DebtStatus.PENDING,
      totalAmount: 1000,
    });

    (prisma.debtParticipant.findUnique as jest.Mock).mockResolvedValue({
      id: 'existing',
    });

    await service.addParticipant('debt-id', 'user-id', 100);

    expect(errorService.handleError).toHaveBeenCalled();
  });

  it('addParticipant → amount exceeds remaining', async () => {
    (prisma.debt.findUnique as jest.Mock).mockResolvedValue({
      status: DebtStatus.PENDING,
      totalAmount: 1000,
    });

    (prisma.debtParticipant.findUnique as jest.Mock).mockResolvedValue(null);

    (prisma.debtParticipant.findMany as jest.Mock).mockResolvedValue([
      { amount: 900 },
    ]);

    await service.addParticipant('debt-id', 'user-id', 200);

    expect(errorService.handleError).toHaveBeenCalled();
  });

  it('addParticipant → OK', async () => {
    (prisma.debt.findUnique as jest.Mock).mockResolvedValue({
      status: DebtStatus.PENDING,
      totalAmount: 1000,
    });

    (prisma.debtParticipant.findUnique as jest.Mock).mockResolvedValue(null);

    (prisma.debtParticipant.findMany as jest.Mock).mockResolvedValue([
      { amount: 200 },
    ]);

    (prisma.debtParticipant.create as jest.Mock).mockResolvedValue({
      id: 'participant-id',
    });

    const result = await service.addParticipant(
      'debt-id',
      'user-id',
      300,
    );

    expect(prisma.debtParticipant.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 'participant-id' });
  });



  it('listParticipants → OK', async () => {
    (prisma.debtParticipant.findMany as jest.Mock).mockResolvedValue([
      { id: 'p1' },
    ]);

    const result = await service.listParticipants('debt-id');

    expect(result).toEqual([{ id: 'p1' }]);
  });

  it('listParticipants → error', async () => {
    (prisma.debtParticipant.findMany as jest.Mock).mockRejectedValue(
      new Error('fail'),
    );

    await service.listParticipants('debt-id');

    expect(errorService.handleError).toHaveBeenCalled();
  });



  it('markParticipantAsPaid → participant not found', async () => {
    (prisma.debtParticipant.findUnique as jest.Mock).mockResolvedValue(
      null,
    );

    await service.markParticipantAsPaid('debt-id', 'user-id');

    expect(errorService.handleError).toHaveBeenCalled();
  });

  it('markParticipantAsPaid → already PAID', async () => {
    (prisma.debtParticipant.findUnique as jest.Mock).mockResolvedValue({
      status: DebtStatus.PAID,
    });

    await service.markParticipantAsPaid('debt-id', 'user-id');

    expect(errorService.handleError).toHaveBeenCalled();
  });

  it('markParticipantAsPaid → pending remains', async () => {
    (prisma.debtParticipant.findUnique as jest.Mock).mockResolvedValue({
      status: DebtStatus.PENDING,
    });

    (prisma.debtParticipant.update as jest.Mock).mockResolvedValue(
      {},
    );

    (prisma.debtParticipant.count as jest.Mock).mockResolvedValue(
      1,
    );

    const result = await service.markParticipantAsPaid(
      'debt-id',
      'user-id',
    );

    expect(result).toEqual({
      message: 'Pago registrado correctamente',
      debtPaid: false,
    });
  });

  it('markParticipantAsPaid → ALL PAID, debt updated', async () => {
    (prisma.debtParticipant.findUnique as jest.Mock).mockResolvedValue({
      status: DebtStatus.PENDING,
    });

    (prisma.debtParticipant.update as jest.Mock).mockResolvedValue(
      {},
    );

    (prisma.debtParticipant.count as jest.Mock).mockResolvedValue(
      0,
    );

    (prisma.debt.update as jest.Mock).mockResolvedValue({});

    const result = await service.markParticipantAsPaid(
      'debt-id',
      'user-id',
    );

    expect(prisma.debt.update).toHaveBeenCalled();
    expect(result).toEqual({
      message: 'Pago registrado correctamente',
      debtPaid: true,
    });
  });
});
