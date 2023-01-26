import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RepositoryService } from '../src/repository/repository.service';
import { LoginDto, RegisterDto } from '../src/auth/dto';
import { CreateTaskDto, EditTaskDto } from 'src/tasks/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let repository: RepositoryService;
  let access_token;
  let userId;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3000);

    repository = app.get(RepositoryService);
    await repository.cleanDb();
  });

  afterAll(() => {
    app.close();
  })

  it('should get hello world!', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });


  describe("Auth", () => {
    const registerDto: RegisterDto = {
      username: "testUser",
      password: "password",
      confirmPassword: "password",
      email: "email@gmail.com"
    };

    const loginDto: LoginDto = {
      username: registerDto.username,
      password: registerDto.password
    }


    it("Should not login because user is not created", () => {
      return request(app.getHttpServer()).post("/auth/login").send(loginDto).expect(HttpStatus.UNAUTHORIZED)
    })

    describe("Register", () => {

      it("Should throw error if username is empty", () => {
        const { username, ...dto } = registerDto;
        return request(app.getHttpServer()).post("/auth/register").send(dto).expect(HttpStatus.BAD_REQUEST)
      });

      it("Should throw error if password is empty", () => {
        const { password, ...dto } = registerDto;
        return request(app.getHttpServer()).post("/auth/register").send(dto).expect(HttpStatus.BAD_REQUEST)
      });

      it("Should throw error if confirmPassword is empty", () => {
        const { confirmPassword, ...dto } = registerDto;
        return request(app.getHttpServer()).post("/auth/register").send(dto).expect(HttpStatus.BAD_REQUEST)
      });

      it("Should register", async () => {
        const res = await request(app.getHttpServer()).post("/auth/register").send(registerDto).expect(HttpStatus.CREATED);
        userId = res.body.id;
        return res;
      });

    });


    describe("Login", () => {

      it("Should not login because dto is empty", () => {
        const dto = {};
        return request(app.getHttpServer()).post("/auth/login").send(dto).expect(HttpStatus.UNAUTHORIZED)
      });

      it("Should not login because username is wrong", () => {
        const dto = { ...loginDto, username: "fake" };
        return request(app.getHttpServer()).post("/auth/login").send(dto).expect(HttpStatus.UNAUTHORIZED)
      });

      it("Should not login because password is wrong", () => {
        const dto = { ...loginDto, password: "fake" };
        return request(app.getHttpServer()).post("/auth/login").send(dto).expect(HttpStatus.UNAUTHORIZED)
      });

      it("Should login succesfully", async () => {
        const res = await request(app.getHttpServer()).post("/auth/login").send(loginDto).expect(HttpStatus.OK)
        access_token = res.body.access_token;
        return res;
      });

    });

  });


  describe("User", () => {

    it("Should throw error because user doesnt exist", () => {
      return request(app.getHttpServer()).get(`/users/${userId+100}`).expect(HttpStatus.BAD_REQUEST)
    });

    it("Should retrive only user created", () => {
      return request(app.getHttpServer()).get(`/users/${userId}`).expect(HttpStatus.OK)
    });

    it("Should NOT edit user email because it has no authorization ", async() => {
      const dto = {email: "pepe@gmail.com"};
      const res = await request(app.getHttpServer()).patch(`/users/edit`).send(dto).expect(HttpStatus.UNAUTHORIZED);
      expect(res.body.email).not.toEqual(dto.email);
    });

    it("Should edit user email", async() => {
      const dto = {email: "pepe@gmail.com"};
      const res = await request(app.getHttpServer()).patch(`/users/edit`).set('Authorization', `Bearer ${access_token}`).send(dto).expect(HttpStatus.OK);
      expect(res.body.email).toEqual(dto.email);
    });

  });


});
