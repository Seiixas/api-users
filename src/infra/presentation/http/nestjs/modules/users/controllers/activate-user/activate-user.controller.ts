import { Controller, Get, HttpCode, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { INVALID_ACTIVATION_CODE_ERROR } from '@/core/modules/users/errors/invalid-activation-code.error';
import { ActivateUserService } from '@/core/modules/users/service/activate-user/activate-user.service';
import { Env } from '@/shared/env';

@Controller('users/activate')
@ApiTags('users')
export class ActivateUserController {
  constructor(private readonly activateUserService: ActivateUserService) {}

  @Get(':code')
  @HttpCode(302)
  @ApiOperation({ summary: 'Ativa um usuário.' })
  @ApiResponse({
    status: 302,
    description: 'Redireciona para a página inicial.',
  })
  @ApiResponse({
    status: INVALID_ACTIVATION_CODE_ERROR.statusCode,
    description: INVALID_ACTIVATION_CODE_ERROR.message,
  })
  async handle(
    @Param('code') code: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.activateUserService.execute({ code });
    response.redirect(Env.WEB_URL);
  }
}
