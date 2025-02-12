import { Module, Provider } from '@nestjs/common';
import { HasherPort } from 'src/core/ports';
import { JwtPort } from 'src/core/ports/jwt.port';
import { HasherProviderBcrypt } from 'src/infra/adapters/bcrypt-hasher.adapter';
import { InMemoryHasherAdapter } from 'src/infra/adapters/hasher.adapter';
import { InMemoryJwtAdapter } from 'src/infra/adapters/jwt.adapter';
import { NestJwtProvider } from 'src/infra/adapters/nestjs-jwt.adapter';
import { Env } from 'src/shared/env';

const inMemoryProviders: Provider[] = [
  {
    provide: HasherPort,
    useClass: InMemoryHasherAdapter,
  },
  {
    provide: JwtPort,
    useClass: InMemoryJwtAdapter,
  },
];

const providers: Provider[] = [
  {
    provide: HasherPort,
    useClass: HasherProviderBcrypt,
  },
  {
    provide: JwtPort,
    useFactory: () => {
      return new NestJwtProvider({
        expiresIn: '1d',
        secret: Env.SECRET,
      });
    },
  },
];

@Module({
  providers: providers,
  exports: [HasherPort, JwtPort],
})
export class AdaptersModule {}
