import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteUserService } from 'src/core/modules/users/service';

@Controller('users')
export class DeleteUserController {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @Delete(':id')
  async handle(@Param('id') id: string) {
    return await this.deleteUserService.execute({ id });
  }
}
