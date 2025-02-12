import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserService } from 'src/core/modules/users/service';
import { CreateUserBody } from './create-user.body';
import {
  ApiBadRequestResponse,
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

@Controller('users')
@ApiTags('users')
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
  async handle(@Body() createUserDTO: CreateUserBody) {
    return await this.createUserService.execute(createUserDTO);
  }
}
