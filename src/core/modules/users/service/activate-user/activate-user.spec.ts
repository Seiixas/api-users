import { CachePort } from '@/core/ports/cache.port';
import { User, UserRepository } from '@/domain/users';
import { MemoryCacheAdapter } from '@/infra/adapters/memory-cache.adapter';
import { InMemoryUserRepository } from '@/infra/persistence/in-memory/in-memory-users.repository';

import { INVALID_ACTIVATION_CODE_ERROR } from '../../errors/invalid-activation-code.error';
import { ActivateUserService } from './activate-user.service';

let usersRepository: UserRepository;
let activateUserService: ActivateUserService;
let cacheAdapter: CachePort;
const code: string = '123456';
const userId = crypto.randomUUID();

describe('Activate User Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository();
    cacheAdapter = new MemoryCacheAdapter();

    activateUserService = new ActivateUserService(
      usersRepository,
      cacheAdapter,
    );

    const user = new User({
      id: userId,
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'my-secret-password',
      isActivated: false,
    });

    await cacheAdapter.set(code, userId);
    await usersRepository.store(user);
  });

  it('should be able to activate a user', async () => {
    await activateUserService.execute({ code });

    const user = await usersRepository.find({
      where: {
        id: userId,
      },
    });

    expect(user.isActivated).toBe(true);
  });

  it('should not be able to activate a user with an invalid code', () => {
    expect(async () => {
      await activateUserService.execute({ code: 'invalid-code' });
    }).rejects.toBe(INVALID_ACTIVATION_CODE_ERROR);
  });
});
