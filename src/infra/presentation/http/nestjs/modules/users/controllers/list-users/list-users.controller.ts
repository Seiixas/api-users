import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListUsersService } from 'src/core/modules/users/service';
import { Roles } from '../../../ability/abilities.decorator';
import { RolesGuard } from '../../../ability/abilities.guard';
import { Actions } from '../../../ability/ability.factory';
import { User } from 'src/domain/users';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
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
  async handle(): Promise<ListUsersToViewResponse> {
    return ListUsersToView.toView(await this.listUsersService.execute());
  }
}
