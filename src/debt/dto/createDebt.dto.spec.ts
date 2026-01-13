import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateDebtInput } from './createDebt.dto';

describe('CreateDebtInput', () => {
  const makeValidInput = (): CreateDebtInput => {
    const input = new CreateDebtInput();
    input.description = 'Deuda de almuerzo';
    input.totalAmount = 10000;
    input.createdById = 'user-id';
    return input;
  };

  it('should pass validation with valid data', async () => {
    const input = makeValidInput();

    const errors = await validate(input);

    expect(errors.length).toBe(0);
  });

  describe('description', () => {
    it('should fail if description is empty', async () => {
      const input = makeValidInput();
      input.description = '';

      const errors = await validate(input);

      const error = errors.find(e => e.property === 'description');
      expect(error).toBeDefined();
      expect(error?.constraints?.isNotEmpty).toBeDefined();
    });
  });

  describe('totalAmount', () => {
    it('should fail if totalAmount is zero', async () => {
      const input = makeValidInput();
      input.totalAmount = 0;

      const errors = await validate(input);

      const error = errors.find(e => e.property === 'totalAmount');
      expect(error).toBeDefined();
      expect(error?.constraints?.isPositive).toBeDefined();
    });

    it('should fail if totalAmount is negative', async () => {
      const input = makeValidInput();
      input.totalAmount = -100;

      const errors = await validate(input);

      const error = errors.find(e => e.property === 'totalAmount');
      expect(error).toBeDefined();
      expect(error?.constraints?.isPositive).toBeDefined();
    });
  });

  describe('createdById', () => {
    it('should fail if createdById is empty', async () => {
      const input = makeValidInput();
      input.createdById = '';

      const errors = await validate(input);

      const error = errors.find(e => e.property === 'createdById');
      expect(error).toBeDefined();
      expect(error?.constraints?.isNotEmpty).toBeDefined();
    });
  });
});
