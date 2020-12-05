import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  genSalt(): Promise<string> {
    return bcrypt.genSalt();
  }
}