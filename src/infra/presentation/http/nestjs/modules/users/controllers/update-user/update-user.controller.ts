import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UpdateUserService } from '@/core/modules/users/service';
import { EUserRoles, User } from '@/domain/users';

import { Roles } from '../../../ability/abilities.decorator';
import { RolesGuard } from '../../../ability/abilities.guard';
import { Actions } from '../../../ability/ability.factory';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { UpdateUserBody } from './update-user.body';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Atualiza um usuário.' })
  @ApiNoContentResponse({ description: 'Usuário atualizado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Requisição inválida.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor.' })
  @Roles({ action: Actions.EDIT, subjects: User })
  @Roles({ action: Actions.EDIT_ANY, subjects: User })
  @Roles({ action: Actions.EDIT_ALL, subjects: User })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async handle(
    @Param('id') id: string,
    @Body() body: UpdateUserBody,
    @Request() request: any,
  ) {
    const user = request.user;
    if (user.role !== EUserRoles.ADMIN && body.role)
      throw new ForbiddenException(
        'Você não tem permissão para alterar o cargo do usuário.',
      );

    await this.updateUserService.execute({ id, ...body });
  }
}
