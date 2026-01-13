import 'reflect-metadata';


jest.mock('./debtParticipant.service', () => ({
  DebtParticipantService: jest.fn().mockImplementation(() => ({
    addParticipant: jest.fn(),
    listParticipants: jest.fn(),
    markParticipantAsPaid: jest.fn(),
  })),
}));


import { Test, TestingModule } from '@nestjs/testing';
import { DebtParticipantResolver } from './debt-participant.resolver';
import { DebtParticipantService } from './debtParticipant.service';

describe('DebtParticipantResolver', () => {
  let resolver: DebtParticipantResolver;
  let service: jest.Mocked<DebtParticipantService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DebtParticipantResolver, DebtParticipantService],
    }).compile();

    resolver = module.get(DebtParticipantResolver);
    service = module.get(
      DebtParticipantService,
    ) as jest.Mocked<DebtParticipantService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* =======================
   * MUTATION: addDebtParticipant
   * ======================= */

  it('addDebtParticipant → should call service with correct params', async () => {
    const debtId = 'debt-id';
    const userId = 'user-id';
    const amount = 5000;

    (service.addParticipant as jest.Mock).mockResolvedValue({
      id: 'participant-id',
      debtId,
      userId,
      amount,
    });

    const result = await resolver.addDebtParticipant(
      debtId,
      userId,
      amount,
    );

    expect(service.addParticipant).toHaveBeenCalledWith(
      debtId,
      userId,
      amount,
    );
    expect(result).toEqual({
      id: 'participant-id',
      debtId,
      userId,
      amount,
    });
  });



  it('debtParticipants → should return participants list', async () => {
    const debtId = 'debt-id';

    (service.listParticipants as jest.Mock).mockResolvedValue([
      { id: 'p1', amount: 1000 },
      { id: 'p2', amount: 2000 },
    ]);

    const result = await resolver.debtParticipants(debtId);

    expect(service.listParticipants).toHaveBeenCalledWith(debtId);
    expect(result).toEqual([
      { id: 'p1', amount: 1000 },
      { id: 'p2', amount: 2000 },
    ]);
  });



  it('payDebtParticipant → should mark participant as paid', async () => {
    const debtId = 'debt-id';
    const userId = 'user-id';

    (service.markParticipantAsPaid as jest.Mock).mockResolvedValue(
      'PARTICIPANT_PAID',
    );

    const result = await resolver.payDebtParticipant(debtId, userId);

    expect(service.markParticipantAsPaid).toHaveBeenCalledWith(
      debtId,
      userId,
    );
    expect(result).toBe('PARTICIPANT_PAID');
  });
});
