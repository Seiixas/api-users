import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserService } from 'src/core/modules/users/service';
import { CreateUserBody } from './create-user.body';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PASSWORD_SIZE_ERROR,
  USER_ALREADY_EXISTS_ERROR,
} from 'src/core/modules/users/errors';
import { Actions } from '../../../ability/ability.factory';
import { User } from 'src/domain/users';
import { RolesGuard } from '../../../ability/abilities.guard';
import { Roles } from '../../../ability/abilities.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  @ApiOperation({ summary: 'Criar usuário.' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse({ description: 'Requisição inválida.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor.' })
  @ApiResponse({
    status: USER_ALREADY_EXISTS_ERROR.statusCode,
    description: USER_ALREADY_EXISTS_ERROR.message,
  })
  @ApiResponse({
    status: PASSWORD_SIZE_ERROR.statusCode,
    description: PASSWORD_SIZE_ERROR.message,
  })
  @Roles({ action: Actions.CREATE, subjects: User })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async handle(@Body() createUserDTO: CreateUserBody): Promise<void> {
    await this.createUserService.execute(createUserDTO);
  }
}
