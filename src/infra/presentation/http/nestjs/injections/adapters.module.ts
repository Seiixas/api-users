import { Module, Provider } from '@nestjs/common';

import { HasherPort } from '@/core/ports';
import { JwtPort } from '@/core/ports/jwt.port';
import { StoragePort } from '@/core/ports/storage.port';
import { HasherProviderBcrypt } from '@/infra/adapters/bcrypt-hasher.adapter';
import { InMemoryHasherAdapter } from '@/infra/adapters/hasher.adapter';
import { InMemoryJwtAdapter } from '@/infra/adapters/jwt.adapter';
import { NestJwtProvider } from '@/infra/adapters/nestjs-jwt.adapter';
import { S3StorageAdapter } from '@/infra/adapters/s3-storage.adpater';
import { Env } from '@/shared/env';

const _inMemoryProviders: Provider[] = [
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
  {
    provide: StoragePort,
    useClass: S3StorageAdapter,
  },
];

@Module({
  providers: providers,
  exports: [HasherPort, JwtPort, StoragePort],
})
export class AdaptersModule {}
