import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserService } from 'src/core/modules/users/service';
import { CreateUserDTO } from './create-user.body';

@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  async handle(@Body() createUserDTO: CreateUserDTO) {
    return await this.createUserService.execute(createUserDTO);
  }
}
