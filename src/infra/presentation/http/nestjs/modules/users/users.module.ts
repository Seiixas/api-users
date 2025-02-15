import { Module } from '@nestjs/common';

import {
  CreateUserService,
  DeleteUserService,
  ListUsersService,
  UpdateUserService,
  UserProfileService,
} from '@/core/modules/users/service';
import { ActivateUserService } from '@/core/modules/users/service/activate-user/activate-user.service';
import { HasherPort } from '@/core/ports';
import { CachePort } from '@/core/ports/cache.port';
import { MailPort } from '@/core/ports/mail.port';
import { StoragePort } from '@/core/ports/storage.port';
import { UserRepository } from '@/domain/users';

import { AdaptersModule } from '../../injections/adapters.module';
import { DatabaseModule } from '../../injections/database.module';
import { AbilityModule } from '../ability/ability.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { ActivateUserController } from './controllers/activate-user/activate-user.controller';
import { CreateUserController } from './controllers/create-user/create-user.controller';
import { DeleteUserController } from './controllers/delete-user/delete-user.controller';
import { ListUsersController } from './controllers/list-users/list-users.controller';
import { UpdateUserController } from './controllers/update-user/update-user.controller';
import { UserProfileController } from './controllers/user-profile/user-profile.controller';

@Module({
  imports: [DatabaseModule, AdaptersModule, AbilityModule],
  controllers: [
    CreateUserController,
    DeleteUserController,
    ListUsersController,
    UserProfileController,
    UpdateUserController,
    ActivateUserController,
  ],
  providers: [
    JwtStrategy,
    {
      provide: CreateUserService,
      useFactory: (
        usersRepository: UserRepository,
        hasherPort: HasherPort,
        storagePort: StoragePort,
        mailPort: MailPort,
        cachePort: CachePort,
      ) =>
        new CreateUserService(
          usersRepository,
          hasherPort,
          storagePort,
          mailPort,
          cachePort,
        ),
      inject: [UserRepository, HasherPort, StoragePort, MailPort, CachePort],
    },
    {
      provide: DeleteUserService,
      useFactory: (usersRepository: UserRepository) =>
        new DeleteUserService(usersRepository),
      inject: [UserRepository],
    },
    {
      provide: ListUsersService,
      useFactory: (usersRepository: UserRepository) =>
        new ListUsersService(usersRepository),
      inject: [UserRepository],
    },
    {
      provide: UserProfileService,
      useFactory: (usersRepository: UserRepository) =>
        new UserProfileService(usersRepository),
      inject: [UserRepository],
    },
    {
      provide: UpdateUserService,
      useFactory: (
        usersRepository: UserRepository,
        hasherPort: HasherPort,
        storagePort: StoragePort,
      ) => new UpdateUserService(usersRepository, hasherPort, storagePort),
      inject: [UserRepository, HasherPort, StoragePort],
    },
    {
      provide: ActivateUserService,
      useFactory: (usersRepository: UserRepository, cachePort: CachePort) =>
        new ActivateUserService(usersRepository, cachePort),
      inject: [UserRepository, CachePort],
    },
  ],
})
export class UsersModule {}
