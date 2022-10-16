import { CreateUserDto } from '../../dto/create-user.dto';
import { LoginUserDto } from '../../dto/login-user.dto';

export class AuthServiceMock {
  token = 'auth-token';
  /**
   * Simulates the method of registration of a new user
   * @param createUserDto : CreateUserDto
   * @returns
   */
  async register(createUserDto: CreateUserDto): Promise<any> {
    const { password, ...userData } = createUserDto;
    return Promise.resolve({
      id: Math.random() * (1000 - 1) + 1,
      ...userData,
      token: this.token,
    });
  }
  /**
   * Simulates the login method of a new user
   * @param loginUserDto
   * @returns
   */
  async login(loginUserDto: LoginUserDto): Promise<any> {
    return Promise.resolve({
      id: Math.random() * (1000 - 1) + 1,
      name: 'name',
      email: loginUserDto.email,
      token: this.token,
    });
  }
}
