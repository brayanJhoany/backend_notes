import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceMock } from './helpers/auth-service-mock';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  /**
   * this block is executed before each test
   */
  beforeEach(async () => {
    const authServiceProvider = {
      provide: AuthService,
      useClass: AuthServiceMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, authServiceProvider],
    })
      .overrideProvider(AuthService)
      .useClass(AuthServiceMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const registerUserDto = {
      name: 'test_name',
      email: 'test@test.com',
      password: '123456789',
    };
    const response = await controller.register(registerUserDto);
    expect(response).toEqual({
      id: expect.any(Number),
      name: registerUserDto.name,
      email: registerUserDto.email,
      token: expect.any(String),
    });
    const registerSpy = jest.spyOn(service, 'register');
    controller.register(registerUserDto);
    expect(registerSpy).toBeCalledWith(registerUserDto);
  });
  it('should login a user', async () => {
    const mockRequest = {
      email: 'test@test.com',
      password: '123456789',
    };
    expect(await controller.login(mockRequest)).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      email: mockRequest.email,
      token: expect.any(String),
    });
    const loginSpy = jest.spyOn(service, 'login');
    controller.login(mockRequest);
    expect(loginSpy).toBeCalledWith(mockRequest);
  });
});
