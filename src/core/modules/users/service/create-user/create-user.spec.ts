import { CachePort } from '@/core/ports/cache.port';
import { MailPort } from '@/core/ports/mail.port';
import { StoragePort } from '@/core/ports/storage.port';
import { UserRepository } from '@/domain/users';
import { InMemoryHasherAdapter } from '@/infra/adapters/hasher.adapter';
import { LocalStorageAdapter } from '@/infra/adapters/local-storage.adapter';
import { MemoryCacheAdapter } from '@/infra/adapters/memory-cache.adapter';
import { InMemoryUserRepository } from '@/infra/persistence/in-memory/in-memory-users.repository';

import { PASSWORD_SIZE_ERROR, USER_ALREADY_EXISTS_ERROR } from '../../errors';
import { CreateUserService } from './create-user.service';

class MockedMail implements MailPort {
  sendMail(_: { to: string; subject: string; body: string }): void {
    return;
  }
}

let createUserService: CreateUserService;
let hasherAdapter: InMemoryHasherAdapter;
let usersRepository: UserRepository;
let storagePort: StoragePort;
let cachePort: CachePort;
let mailAdapter: MailPort;

describe('Create User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    hasherAdapter = new InMemoryHasherAdapter();
    storagePort = new LocalStorageAdapter();
    cachePort = new MemoryCacheAdapter();

    mailAdapter = new MockedMail();

    createUserService = new CreateUserService(
      usersRepository,
      hasherAdapter,
      storagePort,
      mailAdapter,
      cachePort,
    );
  });

  it('should be able to create a user', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: `${crypto.randomUUID()}@doe.com`,
      password: 'my-secret-password',
    });
    expect(user).toHaveProperty('id');
    expect(user.password).not.toBe('my-secret-password');
  });

  it('should not be able to create an user with a password smaller than 8 characters', () => {
    expect(async () => {
      await createUserService.execute({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '1234567',
      });
    }).rejects.toBe(PASSWORD_SIZE_ERROR);
  });

  it('should not be able to create an user with same e-mail of other users', () => {
    expect(async () => {
      await createUserService.execute({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '12345678',
      });
      await createUserService.execute({
        name: 'Mary Doe',
        email: 'john@doe.com',
        password: '87654321',
      });
    }).rejects.toBe(USER_ALREADY_EXISTS_ERROR);
  });
});
