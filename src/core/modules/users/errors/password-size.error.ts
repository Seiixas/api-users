import { CoreError } from '../../../../core/shared/errors/core.error';

class PasswordSizeError extends CoreError {
  constructor() {
    super({
      statusCode: 400,
      message: 'A senha de usuário deve ter pelo menos 8 caracteres.',
    });
  }
}

export const PASSWORD_SIZE_ERROR = new PasswordSizeError();
