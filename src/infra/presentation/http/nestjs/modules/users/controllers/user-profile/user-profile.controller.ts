import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { USER_NOT_FOUND_ERROR } from '@/core/modules/users/errors';
import { UserProfileService } from '@/core/modules/users/service';
import { User } from '@/domain/users';

import { Roles } from '../../../ability/abilities.decorator';
import { RolesGuard } from '../../../ability/abilities.guard';
import { Actions } from '../../../ability/ability.factory';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import {
  UserProfileToView,
  UserProfileToViewResponse,
} from './user-profile.toview';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Perfil do usuário.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor.' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: USER_NOT_FOUND_ERROR.statusCode,
    description: USER_NOT_FOUND_ERROR.message,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles({ action: Actions.READ, subjects: User })
  @Roles({ action: Actions.READ_ANY, subjects: User })
  async handle(@Param('id') id: string): Promise<UserProfileToViewResponse> {
    return UserProfileToView.toView(
      await this.userProfileService.execute({ id }),
    );
  }
}
