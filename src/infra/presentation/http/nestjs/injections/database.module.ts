import { Module, Provider } from '@nestjs/common';
import { UserRepository } from 'src/domain/users';
import { InMemoryUserRepository } from 'src/infra/persistence/in-memory/in-memory-users.repository';

const inMemoryProviders: Provider[] = [
  {
    provide: UserRepository,
    useClass: InMemoryUserRepository,
  },
];

@Module({
  providers: inMemoryProviders,
  exports: [UserRepository],
})
export class DatabaseModule {}
