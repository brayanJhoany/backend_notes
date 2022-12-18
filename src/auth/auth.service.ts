import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const existUser = await this.existUserByEmail(createUserDto.email);
    if (existUser) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists`,
      );
    }
    try {
      const { password, ...userData } = createUserDto;
      const hash = await this.getHashByPassword(password);
      const user = this.userRepository.create({
        ...userData,
        password: hash,
      });

      await this.userRepository.save(user);
      const userResponse = this.transformData(user);
      const token = await this.getJwt({ id: user.id });
      return {
        ...userResponse,
        token,
      };
    } catch (error) {
      this.handlerException(error);
    }
  }
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!this.isValidPassword(password, user.password)) {
      throw new BadRequestException('Invalid password');
    }
    const userResponse = this.transformData(user);
    const token = await this.getJwt({ id: user.id });
    return {
      ...userResponse,
      token,
    };
  }
  async isValidPassword(password: string, hash: string) {
    return await bcrypt.compareSync(password, hash);
  }

  private transformData(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
  async getJwt(jwtPayload: JwtPayload) {
    return await this.jwtService.sign(jwtPayload);
  }
  async existUserByEmail(email: string): Promise<boolean> {
    const countUser = await this.userRepository.count({ where: { email } });
    return countUser > 0;
  }
  private async getHashByPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, bcrypt.genSaltSync(10));
  }
  private handlerException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('User already exists');
    }
    throw new InternalServerErrorException('Internal server error');
  }
}
