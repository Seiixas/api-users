import { Controller, Delete, Param } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { USER_NOT_FOUND_ERROR } from 'src/core/modules/users/errors';
import { DeleteUserService } from 'src/core/modules/users/service';

@Controller('users')
@ApiTags('users')
export class DeleteUserController {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar usuário.' })
  @ApiNoContentResponse()
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor.' })
  @ApiResponse({
    status: USER_NOT_FOUND_ERROR.statusCode,
    description: USER_NOT_FOUND_ERROR.message,
  })
  async handle(@Param('id') id: string) {
    return await this.deleteUserService.execute({ id });
  }
}
