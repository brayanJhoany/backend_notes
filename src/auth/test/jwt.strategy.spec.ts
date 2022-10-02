import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

describe('jwt strategy', () => {
  let jwtStrategy: JwtStrategy;
  let UserRepositoryMock: Repository<User>;
  const userMock: User = {
    id: 1,
    email: 'test@test.com',
    name: 'name test',
    password: 'password',
    isActive: true,
    notes: [],
  };
  beforeEach(async () => {
    process.env.JWT_SECRET =
      'KLSDJF30945DJFDSK9345KJDFLKSD90485DSJFLKSDFJ349JFK';
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(userMock),
          },
        },
      ],
    }).compile();
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    UserRepositoryMock = module.get<Repository<User>>(getRepositoryToken(User));
  });
  afterEach(() => {
    delete process.env.JWT_SECRET;
  });
  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });
  it('should validates and return the user', async () => {
    const payload = { id: 1 };
    const user = await jwtStrategy.validate(payload);
    expect(user).toEqual(userMock);
  });
  it('should throw Unauthorized Exception', async () => {
    const payload = { id: 1 };
    jest.spyOn(UserRepositoryMock, 'findOneBy').mockResolvedValueOnce(null);
    try {
      await jwtStrategy.validate(payload);
    } catch (err) {
      expect(err.message).toEqual('Unauthorized');
    }
  });
});
