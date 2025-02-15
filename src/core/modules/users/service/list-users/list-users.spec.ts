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
        role: EUserRoles.MANAGER,
      }),
    );
  });

  it('should be able to list all users', async () => {
    const users = await listUsersService.execute({ page: 0, limit: 10 });

    expect(users).toHaveLength(2);
    const [usersData, total] = users;
    expect(usersData[0]).toHaveProperty('name', 'John Doe');
    expect(usersData[1]).toHaveProperty('name', 'Mary Doe');
    expect(total).toBe(2);
  });

  it('should be able to list the first user', async () => {
    const users = await listUsersService.execute({ page: 0, limit: 1 });

    expect(users).toHaveLength(2);
    const [usersData, total] = users;
    expect(usersData).toHaveLength(1);
    expect(usersData[0]).toHaveProperty('name', 'John Doe');
    expect(total).toBe(2);
  });

  it('should be able to filter users by name', async () => {
    const users = await listUsersService.execute({
      page: 0,
      limit: 10,
      name: 'John Doe',
    });

    expect(users).toHaveLength(2);
    const [usersData, total] = users;
    expect(usersData[0]).toHaveProperty('name', 'John Doe');
    expect(total).toBe(2);
  });

  it('should be able to filter users by role', async () => {
    const users = await listUsersService.execute({
      page: 0,
      limit: 10,
      role: EUserRoles.STANDARD,
    });

    expect(users).toHaveLength(2);
    const [usersData, total] = users;
    expect(usersData[0]).toHaveProperty('name', 'John Doe');
    expect(total).toBe(2);
  });
});
