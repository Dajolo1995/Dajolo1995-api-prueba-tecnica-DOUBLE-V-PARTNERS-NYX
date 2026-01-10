export const charactersPassword =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export function isValidPassword(password: string): boolean {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password);
  const hasMinLength = password.length >= 8;

  // Verifica que solo use caracteres permitidos
  const allowedCharsRegex = new RegExp(`^[${charactersPassword.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}]+$`);
  const usesOnlyAllowedChars = allowedCharsRegex.test(password);

  return (
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar &&
    hasMinLength &&
    usesOnlyAllowedChars
  );
}