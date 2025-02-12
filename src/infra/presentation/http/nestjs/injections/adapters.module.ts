import { Module, Provider } from '@nestjs/common';
import { HasherPort } from 'src/core/ports';
import { JwtPort } from 'src/core/ports/jwt.port';
import { InMemoryHasherAdapter } from 'src/infra/adapters/hasher.adapter';
import { InMemoryJwtAdapter } from 'src/infra/adapters/jwt.adapter';

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

@Module({
  providers: inMemoryProviders,
  exports: [HasherPort, JwtPort],
})
export class AdaptersModule {}
