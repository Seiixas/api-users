import { Controller, Get, Param } from '@nestjs/common';
import { UserProfileService } from 'src/core/modules/users/service';

@Controller('users')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get(':id')
  async handle(@Param('id') id: string) {
    return await this.userProfileService.execute({ id });
  }
}
