import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticateUserService } from '@/core/modules/auth/services';
import { SignInBody } from './signin.body';

@Controller('auth')
@ApiTags('auth')
export class SignInController {
  constructor(
    private readonly authenticateUserService: AuthenticateUserService,
  ) {}

  @Post('signin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate user.' })
  @ApiOkResponse({
    description: 'User successfully authenticated.',
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
  @ApiBadRequestResponse({ description: 'Invalid request.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid email or password.',
  })
  async signIn(@Body() signInBody: SignInBody) {
    return this.authenticateUserService.execute(signInBody);
  }
}
