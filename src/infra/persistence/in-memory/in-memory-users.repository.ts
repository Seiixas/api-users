import { AllParams } from '@/domain/shared/repository/repository';

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

  async all(filters: AllParams): Promise<[User[], number]> {
    let usersFilter = this.users;

    if (filters.name) {
      usersFilter = this.users.filter((user) => user.name === filters.name);
    }

    if (filters.role) {
      usersFilter = this.users.filter((user) => user.role === filters.role);
    }

    return [usersFilter.slice(filters.page, filters.limit), this.users.length];
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const index = this.users.findIndex((user) => user.id === id);

    this.users[index].name = data.name || this.users[index].name;
    this.users[index].email = data.email || this.users[index].email;
    this.users[index].password = data.password || this.users[index].password;
    this.users[index].role = data.role || this.users[index].role;
    this.users[index].isActivated =
      data.isActivated || this.users[index].isActivated;
    this.users[index].avatar = data.avatar || this.users[index].avatar;

    return this.users[index];
  }
}
