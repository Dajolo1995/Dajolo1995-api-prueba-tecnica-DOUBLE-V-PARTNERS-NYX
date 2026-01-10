import { charactersPassword } from './validatePassword';

export const generateCode = (length: number): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charactersPassword.charAt(
      Math.floor(Math.random() * charactersPassword.length),
    );
  }
  return result;
};

export const generateRandomCode = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
