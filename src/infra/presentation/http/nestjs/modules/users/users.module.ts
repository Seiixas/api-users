import { Module } from '@nestjs/common';
import { CreateUserController } from './controllers/create-user/create-user.controller';
import {
  CreateUserService,
  DeleteUserService,
  ListUsersService,
  UpdateUserService,
  UserProfileService,
} from 'src/core/modules/users/service';
import { UserRepository } from 'src/domain/users';
import { HasherPort } from 'src/core/ports';
import { DatabaseModule } from '../../injections/database.module';
import { AdaptersModule } from '../../injections/adapters.module';
import { DeleteUserController } from './controllers/delete-user/delete-user.controller';
import { ListUsersController } from './controllers/list-users/list-users.controller';
import { UserProfileController } from './controllers/user-profile/user-profile.controller';
import { AbilityModule } from '../ability/ability.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UpdateUserController } from './controllers/update-user/update-user.controller';

@Module({
  imports: [DatabaseModule, AdaptersModule, AbilityModule],
  controllers: [
    CreateUserController,
    DeleteUserController,
    ListUsersController,
    UserProfileController,
    UpdateUserController,
  ],
  providers: [
    JwtStrategy,
    {
      provide: CreateUserService,
      useFactory: (usersRepository: UserRepository, hasherPort: HasherPort) =>
        new CreateUserService(usersRepository, hasherPort),
      inject: [UserRepository, HasherPort],
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
      useFactory: (usersRepository: UserRepository, hasherPort: HasherPort) =>
        new UpdateUserService(usersRepository, hasherPort),
      inject: [UserRepository, HasherPort],
    },
  ],
})
export class UsersModule {}
