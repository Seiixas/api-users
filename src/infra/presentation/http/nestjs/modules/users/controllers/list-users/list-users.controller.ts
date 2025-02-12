import { Controller, Get } from '@nestjs/common';
import { ListUsersService } from 'src/core/modules/users/service';

@Controller('users')
export class ListUsersController {
  constructor(private readonly listUsersService: ListUsersService) {}

  @Get()
  async handle() {
    return await this.listUsersService.execute();
  }
}
