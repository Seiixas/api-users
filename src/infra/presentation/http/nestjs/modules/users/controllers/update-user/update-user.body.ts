import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { EUserRoles } from 'src/domain/users';

export class UpdateUserBody {
  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: 'Nome do usuário.',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: String,
    example: 'mary@doe.com',
    description: 'E-mail do usuário.',
    required: false,
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    type: String,
    example: 'password',
    description: 'Senha do usuário.',
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    type: String,
    example: 'STANDARD',
    description: 'Função do usuário.',
    required: false,
  })
  @IsEnum(EUserRoles)
  @IsOptional()
  role?: EUserRoles;
}
