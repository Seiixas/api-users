import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticateUserService } from '@/core/modules/auth/services';
import { CoreError } from '@/core/shared/errors/core.error';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticateUserService: AuthenticateUserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authenticateUserService.execute({
      email,
      password,
    });

    if (!user) {
      throw new CoreError({
        message: 'Invalid email or password',
        statusCode: 401,
      });
    }

    return user;
  }
}
