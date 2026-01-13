import { generateCode, generateRandomCode } from './generateCode';
import { charactersPassword } from './validatePassword';

describe('generateCode', () => {
  it('should return a string with the given length', () => {
    const length = 6;
    const result = generateCode(length);

    expect(result).toHaveLength(length);
  });

  it('should only contain valid characters from charactersPassword', () => {
    const result = generateCode(20);

    for (const char of result) {
      expect(charactersPassword).toContain(char);
    }
  });

  it('should generate different values on multiple calls (randomness)', () => {
    const r1 = generateCode(10);
    const r2 = generateCode(10);

    expect(r1).not.toBe(r2);
  });

  it('should return empty string when length is 0', () => {
    expect(generateCode(0)).toBe('');
  });
});

describe('generateRandomCode', () => {
  const allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789';

  it('should return a string with the given length', () => {
    const length = 8;
    const result = generateRandomCode(length);

    expect(result).toHaveLength(length);
  });

  it('should only contain uppercase letters and numbers', () => {
    const result = generateRandomCode(20);

    for (const char of result) {
      expect(allowedCharacters).toContain(char);
    }
  });

  it('should generate different values on multiple calls (randomness)', () => {
    const r1 = generateRandomCode(10);
    const r2 = generateRandomCode(10);

    expect(r1).not.toBe(r2);
  });

  it('should return empty string when length is 0', () => {
    expect(generateRandomCode(0)).toBe('');
  });
});
