import { EUserRoles, User, UserRepository } from '@/domain/users';
import { InMemoryUserRepository } from '@/infra/persistence/in-memory/in-memory-users.repository';

import { ListUsersService } from './list-users.service';

let listUsersService: ListUsersService;
let usersRepository: UserRepository;

describe('List Users Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    listUsersService = new ListUsersService(usersRepository);

    usersRepository.store(
      new User({
        id: '1',
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'my-secret-password',
        role: EUserRoles.STANDARD,
      }),
    );

    usersRepository.store(
      new User({
        id: '1',
        name: 'Mary Doe',
        email: 'mary@doe.com',
        password: 'mari-secret-password',
        role: EUserRoles.STANDARD,
      }),
    );
  });

  it('should be able to list all users', async () => {
    const users = await listUsersService.execute();

    expect(users).toHaveLength(2);
    expect(users[0]).toHaveProperty('name', 'John Doe');
    expect(users[1]).toHaveProperty('name', 'Mary Doe');
  });
});
