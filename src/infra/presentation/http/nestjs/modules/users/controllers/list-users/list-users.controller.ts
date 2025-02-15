import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ListUsersService } from '@/core/modules/users/service';
import { User } from '@/domain/users';

import { Roles } from '../../../ability/abilities.decorator';
import { RolesGuard } from '../../../ability/abilities.guard';
import { Actions } from '../../../ability/ability.factory';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ListUsersQuery } from './list-users.query';
import { ListUsersToView, ListUsersToViewResponse } from './list-users.toview';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class ListUsersController {
  constructor(private readonly listUsersService: ListUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuários.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor.' })
  @ApiResponse({
    status: 200,
    description: 'Usuários listados com sucesso.',
    schema: {
      type: 'array',
      items: {
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
    },
  })
  @Roles({ action: Actions.READ_ANY, subjects: User })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async handle(
    @Query() query: ListUsersQuery,
  ): Promise<ListUsersToViewResponse> {
    const users = await this.listUsersService.execute(query);
    return ListUsersToView.toView(users[0], users[1]);
  }
}
