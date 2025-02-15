import 'dotenv/config';

import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

class EnvVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  SECRET: string;

  @IsString()
  SERVER_URL: string;

  @IsString()
  AWS_REGION: string;

  @IsString()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  AWS_BUCKET_NAME: string;

  @IsString()
  AWS_ENDPOINT: string;
}

function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Config validation error: ${errors.map((err) => Object.values(err.constraints).join(', ')).join('; ')}`,
    );
  }

  return validatedConfig;
}

export const Env = validateEnv(process.env);
