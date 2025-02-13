import { Module, Provider } from '@nestjs/common';
import { UserRepository } from '@/domain/users';
import { dataSource } from '@/infra/persistence/database/typeorm/connection';
import { UserEntity } from '@/infra/persistence/database/typeorm/entities/user.entity';
import { TypeORMUserRepository } from '@/infra/persistence/database/typeorm/repositories/typeorm-user.repository';
import { TypeOrmService } from '@/infra/persistence/database/typeorm/typeorm.service';
import { InMemoryUserRepository } from '@/infra/persistence/in-memory/in-memory-users.repository';

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
