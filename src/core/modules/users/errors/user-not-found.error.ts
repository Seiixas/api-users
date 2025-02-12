import { CoreError } from '../../../../core/shared/errors/core.error';

class UserNotFoundError extends CoreError {
  constructor() {
    super({
      statusCode: 404,
      message: 'Usuário não encontrado.',
    });
  }
}

export const USER_NOT_FOUND_ERROR = new UserNotFoundError();
