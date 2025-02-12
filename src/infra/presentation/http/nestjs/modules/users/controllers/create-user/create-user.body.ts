import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
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
}
