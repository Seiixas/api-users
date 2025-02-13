import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthenticateUserService } from '@/core/modules/auth/services';
import { HasherPort } from '@/core/ports';
import { JwtPort } from '@/core/ports/jwt.port';
import { UserRepository } from '@/domain/users';

import { AdaptersModule } from '../../injections/adapters.module';
import { DatabaseModule } from '../../injections/database.module';
import { UsersModule } from '../users/users.module';
import { SignInController } from './controllers/signin/signin.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [PassportModule, UsersModule, DatabaseModule, AdaptersModule],
  providers: [
    LocalStrategy,
    JwtStrategy,
    {
      provide: AuthenticateUserService,
      useFactory: (
        usersRepository: UserRepository,
        hashPort: HasherPort,
        jwtPort: JwtPort,
      ) => new AuthenticateUserService(usersRepository, hashPort, jwtPort),
      inject: [UserRepository, HasherPort, JwtPort],
    },
  ],
  controllers: [SignInController],
})
export class AuthModule {}
