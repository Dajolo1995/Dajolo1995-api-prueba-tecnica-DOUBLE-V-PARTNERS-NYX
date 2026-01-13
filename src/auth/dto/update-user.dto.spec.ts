import 'reflect-metadata';
import { validate } from 'class-validator';
import { UpdateUserDto } from './updateUser.dto';

describe('UpdateUserDto', () => {
  const makeValidDto = (): UpdateUserDto => {
    const dto = new UpdateUserDto();
    dto.email = 'test@example.com';
    dto.password = 'password123';
    dto.nickname = 'nick';
    dto.name = 'Daniel';
    dto.lastName = 'Lobo';
    dto.phone = '+573001234567';
    dto.code = 'ABC123';
    dto.isActive = true;
    return dto;
  };

  it('should pass validation with all optional valid fields', async () => {
    const dto = makeValidDto();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should pass validation with empty dto (all fields optional)', async () => {
    const dto = new UpdateUserDto();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  describe('email', () => {
    it('should fail if email is invalid', async () => {
      const dto = new UpdateUserDto();
      dto.email = 'invalid-email';

      const errors = await validate(dto);

      const error = errors.find(e => e.property === 'email');
      expect(error).toBeDefined();
    });
  });

  describe('password', () => {
    it('should fail if password is too short', async () => {
      const dto = new UpdateUserDto();
      dto.password = '123';

      const errors = await validate(dto);

      const error = errors.find(e => e.property === 'password');
      expect(error).toBeDefined();
      expect(error?.constraints?.minLength).toBeDefined();
    });
  });

  describe('phone', () => {
    it('should fail if phone has invalid characters', async () => {
      const dto = new UpdateUserDto();
      dto.phone = 'abc123';

      const errors = await validate(dto);

      const error = errors.find(e => e.property === 'phone');
      expect(error).toBeDefined();
      expect(error?.constraints?.matches).toBeDefined();
    });
  });

  describe('isActive', () => {
    it('should fail if isActive is not boolean', async () => {
      const dto = new UpdateUserDto();
      dto.isActive = true

      const errors = await validate(dto);

      const error = errors.find(e => e.property === 'isActive');
      expect(error).not.toBeDefined();
      expect(error?.constraints?.isBoolean).not.toBeDefined();
    });
  });

  describe('string fields', () => {
    it.each([
      ['nickname'],
      ['name'],
      ['lastName'],
      ['code'],
    ])('should fail if %s is not string', async (field) => {
      const dto = new UpdateUserDto();
      dto[field] = 123;

      const errors = await validate(dto);

      const error = errors.find(e => e.property === field);
      expect(error).toBeDefined();
      expect(error?.constraints?.isString).toBeDefined();
    });
  });
});
