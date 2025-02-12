import { compare as useCompare, hash } from 'bcrypt';
import { HasherPort } from 'src/core/ports';

export class HasherProviderBcrypt implements HasherPort {
  async hash(value: string): Promise<string> {
    const hashedValue = await hash(value, 12);
    return hashedValue;
  }

  async compare(value: string, _value: string): Promise<boolean> {
    return await useCompare(value, _value);
  }
}
