import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scriptAsync = promisify(scrypt);
const SALT_LENGTH = 8;
const EPWD_LENGTH = 16;

export class Password {
  static async generateKey(password: string, salt: string): Promise<string> {
    return ((await scriptAsync(password, salt, EPWD_LENGTH)) as Buffer).toString('hex');
  }

  static async toHash(password: string): Promise<string> {
    const salt = randomBytes(SALT_LENGTH).toString('hex');
    const key = await Password.generateKey(password, salt);
    return `${key}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const key = await Password.generateKey(suppliedPassword, salt);
    return key === hashedPassword;
  }
}
