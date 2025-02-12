import { CoreError } from '../../../../core/shared/errors/core.error';

class UserAlreadyExistsError extends CoreError {
  constructor() {
    super({
      statusCode: 409,
      message: 'Usuário já está cadastrado.',
    });
  }
}

export const USER_ALREADY_EXISTS_ERROR = new UserAlreadyExistsError();
