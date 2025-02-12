import { User, UserRepository } from '../../../domain/users';

export class InMemoryUserRepository implements UserRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  async store(data: User): Promise<User> {
    this.users.push(data);
    return data;
  }

  async find({ where }: { where: Partial<User> }): Promise<User> {
    return this.users.find((user) =>
      Object.entries(where).every(([key, value]) => user[key] === value),
    );
  }

  async remove(item: User): Promise<void> {
    const index = this.users.findIndex((user) => user.id === item.id);

    if (index < 0) {
      return;
    }

    this.users.splice(index, 1);
  }

  async all(): Promise<User[]> {
    return this.users;
  }

  async update(old: User, _new: Partial<User>): Promise<User> {
    const index = this.users.findIndex((user) => user.id === old.id);

    if (index === -1) {
      throw new Error('User not found');
    }

    // Update fields using class methods if they exist
    const user = this.users[index];

    if (_new.name !== undefined) user.name = _new.name;
    if (_new.email !== undefined) user.email = _new.email;
    if (_new.password !== undefined) user.password = _new.password;
    if (_new.role !== undefined) user.role = _new.role;

    return user;
  }
}
