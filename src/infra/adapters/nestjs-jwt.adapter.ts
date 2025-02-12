import { JwtService } from '@nestjs/jwt';
import { JwtPort } from 'src/core/ports/jwt.port';

interface ConstructorProps {
  expiresIn: string;
  secret: string;
}

export class NestJwtProvider implements JwtPort {
  private readonly jwtService: JwtService;

  constructor(props: ConstructorProps) {
    this.jwtService = new JwtService({
      secret: props.secret,
      signOptions: {
        expiresIn: props.expiresIn,
      },
    });
  }

  decode(token: string): { id: string } {
    return this.jwtService.decode(token) as { id: string };
  }

  sign(payload: any): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string): boolean {
    try {
      this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }
}
