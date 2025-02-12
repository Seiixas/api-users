import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EUserRoles } from 'src/domain/users';

export class CreateUserBody {
  @ApiProperty({
    type: String,
    description: 'User name.',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'User email.',
    example: 'john@doe.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'User password.',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

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
