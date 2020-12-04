import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUserByUsername(username: string): Promise<User> {
    return this.findOne({ username });
  }
}