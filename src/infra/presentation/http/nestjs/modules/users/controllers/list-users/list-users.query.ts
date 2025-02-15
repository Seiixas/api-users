import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { EUserRoles } from '@/domain/users';

export class ListUsersQuery {
  @ApiProperty({
    description: 'Número da página.',
    required: false,
    type: Number,
    example: 1,
  })
  @IsOptional()
  page: number = 1;

  @ApiProperty({
    description: 'Número de registros por página.',
    required: false,
    type: Number,
    example: 10,
  })
  @IsOptional()
  limit: number = 10;

  @ApiProperty({
    description: 'Nome do usuário.',
    required: false,
    type: String,
    example: 'John Doe',
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Perfil do usuário.',
    required: false,
    type: String,
    example: 'STANDARD',
  })
  @IsEnum(EUserRoles)
  @IsOptional()
  role?: EUserRoles;
}
