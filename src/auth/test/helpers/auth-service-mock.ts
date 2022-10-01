import { CreateUserDto } from '../../dto/create-user.dto';
import { LoginUserDto } from '../../dto/login-user.dto';

export class AuthServiceMock {
  async register(createUserDto: CreateUserDto): Promise<any> {
    return Promise.resolve({
      id: Math.random() * (1000 - 1) + 1,
      name: createUserDto.name,
      email: createUserDto.email,
    });
  }
  async login(loginUserDto: LoginUserDto): Promise<any> {
    return Promise.resolve({
      id: Math.random() * (1000 - 1) + 1,
      name: 'name',
      email: loginUserDto.email,
      token: 'auth-token',
    });
  }
}
