/**
 * Generates a random invoice ID in the format XX0000
 * where X is an uppercase letter and 0 is a digit
 */
export function generateId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const randLetter = () => letters[Math.floor(Math.random() * letters.length)];
  const randDigit = () => digits[Math.floor(Math.random() * digits.length)];
  return (
    randLetter() +
    randLetter() +
    randDigit() +
    randDigit() +
    randDigit() +
    randDigit()
  );
}
