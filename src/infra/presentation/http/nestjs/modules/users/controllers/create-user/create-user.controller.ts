import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
} from '@/core/modules/users/errors';
import { CreateUserService } from '@/core/modules/users/service';
import { User } from '@/domain/users';

import { Roles } from '../../../ability/abilities.decorator';
import { RolesGuard } from '../../../ability/abilities.guard';
import { Actions } from '../../../ability/ability.factory';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreateUserBody } from './create-user.body';

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
  @UseInterceptors(FileInterceptor('avatar'))
  async handle(
    @Body() createUserDTO: CreateUserBody,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    await this.createUserService.execute({
      ...createUserDTO,
      avatar,
    });
  }
}
