import { InMemoryUserRepository } from '../../../../../infra/persistence/in-memory/in-memory-users.repository';
import { User, UserRepository } from '../../../../../domain/users';
import { UserProfileService } from './user-profile.service';
import { USER_NOT_FOUND_ERROR } from '../../errors';

let userProfileService: UserProfileService;
let usersRepository: UserRepository;

describe('User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    userProfileService = new UserProfileService(usersRepository);

    usersRepository.store(
      new User({
        id: '1',
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'my-secret-password',
        role: '',
      }),
    );
  });

  it('should be able to get the user profile', async () => {
    const user = await userProfileService.execute({ id: '1' });

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name', 'John Doe');
    expect(user).toHaveProperty('email', 'john@doe.com');
  });

  it('should not be able to get the user profile if the user does not exist', () => {
    expect(async () => {
      await userProfileService.execute({ id: '2' });
    }).rejects.toBe(USER_NOT_FOUND_ERROR);
  });
});
