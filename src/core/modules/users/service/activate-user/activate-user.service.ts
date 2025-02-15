import { CachePort } from '@/core/ports/cache.port';
import { CoreService } from '@/core/shared/services/core.service';
import { UserRepository } from '@/domain/users';

import { INVALID_ACTIVATION_CODE_ERROR } from '../../errors/invalid-activation-code.error';

type Request = {
  code: string;
};

type Response = void | string;

export class ActivateUserService implements CoreService<Request, Response> {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly cachePort: CachePort,
  ) {}

  async execute({ code }: Request): Promise<Response> {
    const codeExists = await this.cachePort.get(code);

    console.log('codeExists =>> ', codeExists);

    if (!codeExists) throw INVALID_ACTIVATION_CODE_ERROR;

    const userId = codeExists;
    await this.usersRepository.update(userId, { isActivated: true });

    this.cachePort.delete(code);
  }
}
