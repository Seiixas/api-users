import { Repository } from '../shared/repository/repository';
import { User } from './user.entity';

export abstract class UserRepository extends Repository<User> {}
