import { hash, compare } from 'bcryptjs';

export default class HashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 10);
  }

  public async compare(payload: string, hash: string): Promise<boolean> {
    return compare(payload, hash);
  }
}
