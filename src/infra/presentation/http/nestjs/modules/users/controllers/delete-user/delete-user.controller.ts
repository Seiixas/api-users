import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { USER_NOT_FOUND_ERROR } from '@/core/modules/users/errors';
import { DeleteUserService } from '@/core/modules/users/service';
import { User } from '@/domain/users';

import { Roles } from '../../../ability/abilities.decorator';
import { RolesGuard } from '../../../ability/abilities.guard';
import { Actions } from '../../../ability/ability.factory';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class DeleteUserController {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Deletar usuário.' })
  @ApiNoContentResponse()
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor.' })
  @ApiResponse({
    status: USER_NOT_FOUND_ERROR.statusCode,
    description: USER_NOT_FOUND_ERROR.message,
  })
  @Roles({ action: Actions.DELETE, subjects: User })
  @Roles({ action: Actions.DELETE_ANY, subjects: User })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async handle(@Param('id') id: string) {
    return await this.deleteUserService.execute({ id });
  }
}
