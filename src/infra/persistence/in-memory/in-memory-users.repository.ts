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

  async update(id: string, data: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
