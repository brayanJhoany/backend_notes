import { toArray } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

export class AuthRepositoryMock {
  mockUser: User = {
    id: 1,
    email: 'success@gmail.com',
    password: 'password',
    name: 'test_name',
    isActive: true,
    notes: [],
  };

  create(user: User) {
    return this.mockUser;
  }
  save(user: User): Promise<User> {
    return Promise.resolve(this.mockUser);
  }
  findOne(email: any): Promise<User> {
    return Promise.resolve(this.mockUser);
  }
}
