import 'reflect-metadata';
import { validate } from 'class-validator';
import { AddDebtParticipantDto } from './add-debt-participant.dto';

describe('AddDebtParticipantDto', () => {
  const makeValidDto = (): AddDebtParticipantDto => {
    const dto = new AddDebtParticipantDto();
    dto.userId = '550e8400-e29b-41d4-a716-446655440000';
    dto.amount = 1000;
    return dto;
  };

  it('should pass validation with valid data', async () => {
    const dto = makeValidDto();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  describe('userId', () => {
    it('should fail if userId is not a UUID', async () => {
      const dto = makeValidDto();
      dto.userId = 'not-a-uuid';

      const errors = await validate(dto);

      const error = errors.find(e => e.property === 'userId');
      expect(error).toBeDefined();
      expect(error?.constraints?.isUuid).toBeDefined();
    });
  });

  describe('amount', () => {
    it('should fail if amount is less than 1', async () => {
      const dto = makeValidDto();
      dto.amount = 0;

      const errors = await validate(dto);

      const error = errors.find(e => e.property === 'amount');
      expect(error).toBeDefined();
      expect(error?.constraints?.min).toBeDefined();
    });

    it('should fail if amount is not a number', async () => {
      const dto:any = makeValidDto();
      dto.amount = '1000';

      const errors = await validate(dto);

      const error = errors.find(e => e.property === 'amount');
      expect(error).toBeDefined();
      expect(error?.constraints?.isNumber).toBeDefined();
    });
  });
});
