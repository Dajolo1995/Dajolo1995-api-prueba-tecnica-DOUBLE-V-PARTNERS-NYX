import 'reflect-metadata';

jest.mock('./debtParticipant.service', () => ({
  DebtParticipantService: jest.fn().mockImplementation(() => ({
    addParticipant: jest.fn(),
    listParticipants: jest.fn(),
    markParticipantAsPaid: jest.fn(),
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { DebtParticipantController } from './debt-participant.controller';
import { DebtParticipantService } from './debtParticipant.service';
import { AddDebtParticipantDto } from './dto/add-debt-participant.dto';

describe('DebtParticipantController', () => {
  let controller: DebtParticipantController;
  let service: jest.Mocked<DebtParticipantService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebtParticipantController],
      providers: [DebtParticipantService],
    }).compile();

    controller = module.get(DebtParticipantController);
    service = module.get(
      DebtParticipantService,
    ) as jest.Mocked<DebtParticipantService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('addDebtParticipant → should call service with correct params', async () => {
    const debtId = 'debt-id';
    const body: AddDebtParticipantDto = {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      amount: 5000,
    };

    (service.addParticipant as jest.Mock).mockResolvedValue({
      success: true,
    });

    const result = await controller.addDebtParticipant(debtId, body);

    expect(service.addParticipant).toHaveBeenCalledWith(
      debtId,
      body.userId,
      body.amount,
    );
    expect(result).toEqual({ success: true });
  });

  it('listDebtParticipants → should return participants', async () => {
    const debtId = 'debt-id';

    (service.listParticipants as jest.Mock).mockResolvedValue([
      { userId: 'user-1', amount: 1000 },
    ]);

    const result = await controller.listDebtParticipants(debtId);

    expect(service.listParticipants).toHaveBeenCalledWith(debtId);
    expect(result).toEqual([{ userId: 'user-1', amount: 1000 }]);
  });

  it('payDebtParticipant → should mark participant as paid', async () => {
    const debtId = 'debt-id';
    const userId = 'user-id';

    (service.markParticipantAsPaid as jest.Mock).mockResolvedValue({
      paid: true,
    });

    const result = await controller.payDebtParticipant(debtId, userId);

    expect(service.markParticipantAsPaid).toHaveBeenCalledWith(debtId, userId);
    expect(result).toEqual({ paid: true });
  });
});
