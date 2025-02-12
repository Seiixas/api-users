import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticateUserService } from 'src/core/modules/auth/services';
import { SignInBody } from './signin.body';
import { UNAUTHORIZED_AUTH_ERROR } from 'src/core/modules/auth/errors';

@Controller('auth')
@ApiTags('auth')
export class SignInController {
  constructor(
    private readonly authenticateUserService: AuthenticateUserService,
  ) {}

  @Post('signin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Autenticar usuário.' })
  @ApiOkResponse({
    description: 'Usuário autenticado com sucesso.',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Requisição inválida.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor.' })
  @ApiResponse({
    status: UNAUTHORIZED_AUTH_ERROR.statusCode,
    description: UNAUTHORIZED_AUTH_ERROR.message,
  })
  async signIn(@Body() signInBody: SignInBody) {
    return await this.authenticateUserService.execute(signInBody);
  }
}
