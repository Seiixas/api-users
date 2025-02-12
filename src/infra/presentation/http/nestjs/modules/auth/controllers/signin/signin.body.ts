import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInBody {
  @ApiProperty({
    type: String,
    example: 'john@doe.com',
    description: 'E-mail de usuário',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    example: '123456',
    description: 'Senha de usuário',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
