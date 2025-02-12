import { Body, Controller, Param, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserService } from 'src/core/modules/users/service';
import { UpdateUserBody } from './update-user.body';

@Controller('users')
@ApiTags('users')
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um usuário.' })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Requisição inválida.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor.' })
  async handle(
    @Param('id') id: string,
    @Body() body: UpdateUserBody,
  ): Promise<void> {
    await this.updateUserService.execute({ id, ...body });
  }
}
