import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

/**
 * Make an promised based version of the scrypt function
 */
const scryptAsync = promisify(scrypt);

export class Password {
  /**
   * Generate a salt, hash the password, return the result concatenating with the salt
   * @param password
   */
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buffer.toString('hex')}.${salt}`;
  }

  /**
   * Compare the existing password with the supplied password.
   * @param storedPassword
   * @param suppliedPassword
   */
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return buffer.toString('hex') === hashedPassword;
  }
}
