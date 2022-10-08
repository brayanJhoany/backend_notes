import { User } from '../../src/auth/entities/user.entity';

export class DbHelper {
  user: User = {
    id: 0,
    name: 'Nuevo_usuario',
    email: 'test@test.com',
    password: 'passwordPrueba',
    isActive: true,
    notes: [],
  };
  //add user to database
  //   async addUser(user: User) {
  //     const newUser = await this.userRepository.save(user);
  //     return newUser;
  //   }
}
