import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../../injections/database.module';
import { AdaptersModule } from '../../injections/adapters.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthenticateUserService } from '@/core/modules/auth/services';
import { UserRepository } from '@/domain/users';
import { HasherPort } from '@/core/ports';
import { JwtPort } from '@/core/ports/jwt.port';
import { SignInController } from './controllers/signin/signin.controller';

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
