import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { USER_NOT_FOUND_ERROR } from 'src/core/modules/users/errors';
import { UserProfileService } from 'src/core/modules/users/service';

@Controller('users')
@ApiTags('users')
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
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: USER_NOT_FOUND_ERROR.statusCode,
    description: USER_NOT_FOUND_ERROR.message,
  })
  async handle(@Param('id') id: string) {
    return await this.userProfileService.execute({ id });
  }
}
