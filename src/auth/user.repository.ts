import { PasswordConfig } from './interface/password-config.interface';
import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as config from 'config';

const passwordConfig: PasswordConfig = config.get('password');
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  hashPassword(password): string {
    return bcrypt.hash(password, passwordConfig.saltRounds || process.env.SALT_ROUNDS);
  }

  compare(password, hashedPassword): boolean {
    return bcrypt.compare(password, hashedPassword);
  }
}