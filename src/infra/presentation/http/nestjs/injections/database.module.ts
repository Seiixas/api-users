import { Module, Provider } from '@nestjs/common';
import { UserRepository } from 'src/domain/users';
import { dataSource } from 'src/infra/persistence/database/typeorm/connection';
import { UserEntity } from 'src/infra/persistence/database/typeorm/entities/user.entity';
import { TypeORMUserRepository } from 'src/infra/persistence/database/typeorm/repositories/typeorm-user.repository';
import { TypeOrmService } from 'src/infra/persistence/database/typeorm/typeorm.service';
import { InMemoryUserRepository } from 'src/infra/persistence/in-memory/in-memory-users.repository';

const inMemoryProviders: Provider[] = [
  {
    provide: UserRepository,
    useClass: InMemoryUserRepository,
  },
];

const typeorm: Provider[] = [
  TypeOrmService,
  {
    provide: UserRepository,
    useFactory: () => {
      return new TypeORMUserRepository(dataSource.getRepository(UserEntity));
    },
    inject: [TypeOrmService],
  },
];

@Module({
  providers: typeorm,
  exports: [UserRepository],
})
export class DatabaseModule {}
