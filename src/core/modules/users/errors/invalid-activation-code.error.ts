import { CoreError } from '@/core/shared/errors/core.error';

class InvalidActivationCodeError extends CoreError {
  constructor() {
    super({
      statusCode: 403,
      message: 'Código de ativação inválido.',
    });
  }
}

export const INVALID_ACTIVATION_CODE_ERROR = new InvalidActivationCodeError();
