import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule, AuthModule],
})
export class AppModule {}
