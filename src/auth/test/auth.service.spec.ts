import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthRepositoryMock } from './helpers/auth-repository-mock';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let UserRepositoryMock: Repository<User>;

  const userMock: User = {
    id: 1,
    email: 'success@gmail.com',
    password: 'password',
    name: 'test_name',
    isActive: true,
    notes: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [
        JwtService,
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: AuthRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    UserRepositoryMock = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Register', () => {
    it('should register a new user', async () => {
      const userDto: CreateUserDto = {
        email: userMock.email,
        password: userMock.password,
        name: userMock.name,
      };
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hashPassword'));

      jest
        .spyOn(service, 'getJwt')
        .mockImplementation(() => Promise.resolve('token'));

      const result = await service.register(userDto);
      expect(result).toEqual({
        id: expect.any(Number),
        email: userMock.email,
        name: userMock.name,
        token: 'token',
      });
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(service.getJwt).toHaveBeenCalled();
    });
  });
  describe('Login', () => {
    it('should login a user', async () => {
      const loginDto: LoginUserDto = {
        email: userMock.email,
        password: userMock.password,
      };

      jest
        .spyOn(service, 'getJwt')
        .mockImplementation(() => Promise.resolve('token'));

      const result = await service.login(loginDto);
      expect(result).toEqual({
        id: expect.any(Number),
        name: userMock.name,
        email: userMock.email,
        token: 'token',
      });
      expect(service.getJwt).toHaveBeenCalled();
    });
    it('should throw an error if the user does not exist', async () => {
      const loginDto: LoginUserDto = {
        email: 'error.email@gmail.com',
        password: userMock.password,
      };
      try {
        jest
          .spyOn(UserRepositoryMock, 'findOne')
          .mockImplementation(() => Promise.resolve(null) as any);

        const result = await service.login(loginDto);
      } catch (error) {
        expect(error.message).toBe('Invalid credentials');
        expect(UserRepositoryMock.findOne).toHaveBeenCalled();
      }
    });
  });
});
