import { CoreError } from '@/core/shared/errors/core.error';

class UnauthorizedAuthError extends CoreError {
  constructor() {
    super({
      statusCode: 401,
      message: 'Usuário não autorizado.',
    });
  }
}

export const UNAUTHORIZED_AUTH_ERROR = new UnauthorizedAuthError();
