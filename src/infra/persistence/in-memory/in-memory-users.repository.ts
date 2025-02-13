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
    const index = this.users.findIndex((user) => user.id === id);

    this.users[index].name = data.name || this.users[index].name;
    this.users[index].email = data.email || this.users[index].email;
    this.users[index].password = data.password || this.users[index].password;
    this.users[index].role = data.role || this.users[index].role;

    return this.users[index];
  }
}
