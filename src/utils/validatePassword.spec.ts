import { isValidPassword, charactersPassword } from './validatePassword';

describe('isValidPassword', () => {
  it('should return true for a valid password', () => {
    const password = 'Abcdef1!';

    expect(isValidPassword(password)).toBe(true);
  });

  it('should fail if password has no uppercase letter', () => {
    const password = 'abcdef1!';

    expect(isValidPassword(password)).toBe(false);
  });

  it('should fail if password has no lowercase letter', () => {
    const password = 'ABCDEF1!';

    expect(isValidPassword(password)).toBe(false);
  });

  it('should fail if password has no number', () => {
    const password = 'Abcdefg!';

    expect(isValidPassword(password)).toBe(false);
  });

  it('should fail if password has no special character', () => {
    const password = 'Abcdef12';

    expect(isValidPassword(password)).toBe(false);
  });

  it('should fail if password length is less than 8 characters', () => {
    const password = 'Ab1!a';

    expect(isValidPassword(password)).toBe(false);
  });

  it('should fail if password contains invalid characters', () => {
    const password = 'Abcdef1!🙂';

    expect(isValidPassword(password)).toBe(false);
  });

  it('should fail if password contains spaces', () => {
    const password = 'Abc def1!';

    expect(isValidPassword(password)).toBe(false);
  });

  it('should allow all defined special characters', () => {
    const password = `Aa1${charactersPassword[charactersPassword.length - 1]}aaaa`;

    expect(isValidPassword(password)).toBe(true);
  });

  it('should fail if password is empty', () => {
    expect(isValidPassword('')).toBe(false);
  });

  it('should fail if password uses only allowed chars but misses rules', () => {
    const password = 'abcdefgh';

    expect(isValidPassword(password)).toBe(false);
  });
});
