import { Module, Provider } from '@nestjs/common';
import { HasherPort } from 'src/core/ports';
import { InMemoryHasherAdapter } from 'src/infra/adapters/hasher.adapter';

const inMemoryProviders: Provider[] = [
  {
    provide: HasherPort,
    useClass: InMemoryHasherAdapter,
  },
];

@Module({
  providers: inMemoryProviders,
  exports: [HasherPort],
})
export class AdaptersModule {}
