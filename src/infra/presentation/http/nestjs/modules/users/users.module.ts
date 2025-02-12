import { Module } from '@nestjs/common';
import { CreateUserController } from './controllers/create-user/create-user.controller';
import {
  CreateUserService,
  DeleteUserService,
  ListUsersService,
  UserProfileService,
} from 'src/core/modules/users/service';
import { UserRepository } from 'src/domain/users';
import { HasherPort } from 'src/core/ports';
import { DatabaseModule } from '../../injections/database.module';
import { AdaptersModule } from '../../injections/adapters.module';
import { DeleteUserController } from './controllers/delete-user/delete-user.controller';
import { ListUsersController } from './controllers/list-users/list-users.controller';
import { UserProfileController } from './controllers/user-profile/user-profile.controller';

@Module({
  imports: [DatabaseModule, AdaptersModule],
  controllers: [
    CreateUserController,
    DeleteUserController,
    ListUsersController,
    UserProfileController,
  ],
  providers: [
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
  ],
})
export class UsersModule {}
