import { Module, Provider } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { HasherPort } from '@/core/ports';
import { CachePort } from '@/core/ports/cache.port';
import { JwtPort } from '@/core/ports/jwt.port';
import { MailPort } from '@/core/ports/mail.port';
import { StoragePort } from '@/core/ports/storage.port';
import { HasherProviderBcrypt } from '@/infra/adapters/bcrypt-hasher.adapter';
import { InMemoryHasherAdapter } from '@/infra/adapters/hasher.adapter';
import { InMemoryJwtAdapter } from '@/infra/adapters/jwt.adapter';
import { NestJwtProvider } from '@/infra/adapters/nestjs-jwt.adapter';
import { NodemailerMailAdapter } from '@/infra/adapters/nodemailer-mail.adapter';
import { RedisCacheAdapter } from '@/infra/adapters/redis-cache.adapter';
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
  {
    provide: MailPort,
    useFactory: () => {
      const transporter = nodemailer.createTransport({
        host: Env.MAIL_HOST,
        port: Number(Env.MAIL_PORT),
        auth: {
          user: Env.MAIL_USER,
          pass: Env.MAIL_PASS,
        },
      });
      return new NodemailerMailAdapter(transporter);
    },
  },
  {
    provide: CachePort,
    useClass: RedisCacheAdapter,
  },
];

@Module({
  providers: providers,
  exports: [HasherPort, JwtPort, StoragePort, MailPort, CachePort],
})
export class AdaptersModule {}
