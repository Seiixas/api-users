import { randomUUID } from 'crypto';
import { JwtPort } from 'src/core/ports/jwt.port';

export class InMemoryJwtAdapter implements JwtPort {
  sign(_payload: any): string {
    return randomUUID();
  }

  verify(token: string): boolean {
    return !!token;
  }

  decode(token: string): { id: string } {
    return { id: token };
  }
}
