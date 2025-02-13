import { randomUUID } from 'crypto';
import { JwtPort } from '@/core/ports/jwt.port';

export class InMemoryJwtAdapter implements JwtPort {
  sign(_: any): string {
    return randomUUID();
  }

  verify(token: string): boolean {
    return !!token;
  }

  decode(token: string): { id: string } {
    return { id: token };
  }
}
