import { CoreError } from '@/core/shared/errors/core.error';

class AccountNotActivatedError extends CoreError {
  constructor() {
    super({
      statusCode: 403,
      message:
        'Conta não ativada. Siga as instruções enviadas para o seu e-mail para ativá-la.',
    });
  }
}

export const ACCOUNT_NOT_ACTIVATED_ERROR = new AccountNotActivatedError();
