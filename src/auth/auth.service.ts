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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: await this.encryptPassword(password),
      });

      await this.userRepository.save(user);
      console.log('user', user);
      const userResponse = this.transform(user);
      return {
        user: userResponse,
        // token: this.getJwt({ id: user.id }),
      };
    } catch (error) {
      this.handlerException(error);
    }
  }
  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }
      const isPasswordValid = await bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
      const userResponse = this.transform(user);
      return {
        user: userResponse,
        token: this.getJwt({ id: user.id }),
      };
    } catch (error) {
      this.handlerException(error);
    }
  }

  private transform(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
  private getJwt(jwtPayload: JwtPayload) {
    return this.jwtService.sign(jwtPayload);
  }
  private async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, bcrypt.genSaltSync(10));
  }
  private handlerException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('Note already exists');
    }
    throw new InternalServerErrorException('Internal server error');
  }
}
