import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateUserDto } from './createUser.dto';

describe('CreateUserDto', () => {
  const makeValidDto = (): CreateUserDto => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.password = 'password123';
    dto.nickname = 'nick';
    dto.name = 'Daniel';
    dto.lastName = 'Lobo';
    dto.phone = '+573001234567';
    return dto;
  };

  it('should pass validation with valid data', async () => {
    const dto = makeValidDto();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  describe('email', () => {
    it('should fail if email is invalid', async () => {
      const dto = makeValidDto();
      dto.email = 'invalid-email';

      const errors = await validate(dto);

      expect(errors.some(e => e.property === 'email')).toBe(true);
    });
  });

  describe('password', () => {
    it('should fail if password is too short', async () => {
      const dto = makeValidDto();
      dto.password = '123';

      const errors = await validate(dto);

      const passwordError = errors.find(e => e.property === 'password');
      expect(passwordError).toBeDefined();
      expect(passwordError?.constraints?.minLength).toBeDefined();
    });
  });

  describe('nickname', () => {
    it('should fail if nickname is empty', async () => {
      const dto = makeValidDto();
      dto.nickname = '';

      const errors = await validate(dto);

      const error = errors.find(e => e.property === 'nickname');
      expect(error).toBeDefined();
      expect(error?.constraints?.isNotEmpty).toBeDefined();
    });
  });

  describe('name', () => {
    it('should fail if name is empty', async () => {
      const dto = makeValidDto();
      dto.name = '';

      const errors = await validate(dto);

      const error = errors.find(e => e.property === 'name');
      expect(error).toBeDefined();
      expect(error?.constraints?.isNotEmpty).toBeDefined();
    });
  });

  describe('lastName', () => {
    it('should fail if lastName is empty', async () => {
      const dto = makeValidDto();
      dto.lastName = '';

      const errors = await validate(dto);

      const error = errors.find(e => e.property === 'lastName');
      expect(error).toBeDefined();
      expect(error?.constraints?.isNotEmpty).toBeDefined();
    });
  });

  describe('phone', () => {
    it('should fail if phone is empty', async () => {
      const dto = makeValidDto();
      dto.phone = '';

      const errors = await validate(dto);

      const error = errors.find(e => e.property === 'phone');
      expect(error).toBeDefined();
      expect(error?.constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail if phone has invalid characters', async () => {
      const dto = makeValidDto();
      dto.phone = 'abc123';

      const errors = await validate(dto);

      const error = errors.find(e => e.property === 'phone');
      expect(error).toBeDefined();
      expect(error?.constraints?.matches).toBeDefined();
    });
  });
});
