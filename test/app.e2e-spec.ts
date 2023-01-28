import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RepositoryService } from '../src/repository/repository.service';
import { LoginDto, RegisterDto } from '../src/auth/dto';
import { CreateTaskDto, DeleteTaskDto, EditTaskDto } from 'src/tasks/dto';
import { ImportCollectionDto } from 'src/collections/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let repository: RepositoryService;
  let access_token: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);

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
      return request(app.getHttpServer()).get(`/users/${userId + 100}`).expect(HttpStatus.BAD_REQUEST)
    });

    it("Should retrive only user created", () => {
      return request(app.getHttpServer()).get(`/users/${userId}`).expect(HttpStatus.OK)
    });

    it("Should NOT retrieve user tasks because it has no authorization ", () => {
      return request(app.getHttpServer()).get(`/users/tasks`).expect(HttpStatus.UNAUTHORIZED);
    });

    it("Should retrieve user tasks", async () => {
      const res = await request(app.getHttpServer()).get(`/users/tasks`).set('Authorization', `Bearer ${access_token}`).expect(HttpStatus.OK);
      expect(res.body.tasks).not.toBe([]);
    });

    it("Should NOT edit user email because it has no authorization ", async () => {
      const dto = { email: "pepe@gmail.com" };
      const res = await request(app.getHttpServer()).patch(`/users/edit`).send(dto).expect(HttpStatus.UNAUTHORIZED);
      expect(res.body.email).not.toEqual(dto.email);
    });

    it("Should edit user email", async () => {
      const dto = { email: "pepe@gmail.com" };
      const res = await request(app.getHttpServer()).patch(`/users/edit`).set('Authorization', `Bearer ${access_token}`).send(dto).expect(HttpStatus.OK);
      expect(res.body.email).toEqual(dto.email);
    });


    it("Should create and delete a new user", async () => {
      const registerDto_: RegisterDto = {
        username: "newUser",
        password: "newPassword",
        confirmPassword: "newPassword",
        email: "email@gmail.com"
      };
  
      const loginDto_: LoginDto = {
        username: registerDto_.username,
        password: registerDto_.password
      }

      let res = await request(app.getHttpServer()).post(`/auth/register`).send(registerDto_).expect(HttpStatus.CREATED);
      const currId = res.body.id;

      res = await request(app.getHttpServer()).post(`/auth/login`).send(loginDto_).expect(HttpStatus.OK);
      const token = res.body.access_token;

      res = await request(app.getHttpServer()).delete(`/users/delete`).set('Authorization', `Bearer ${token}`).expect(HttpStatus.OK);
    });

  });


  describe("Task", () => {
    let taskId;
    const taskDto: CreateTaskDto = {
      content: "My task",
      status: "TODO"
    };

    it("should return an empty array", async () => {
      const res = await request(app.getHttpServer()).get(`/tasks/all`).expect(HttpStatus.OK);
      expect(res.body).toEqual([]);
    });

    it("should not create a task because its not authorized", () => {
      return request(app.getHttpServer()).post(`/tasks/create`).send(taskDto).expect(HttpStatus.UNAUTHORIZED);
    });

    it("should create a task", async () => {
      const res = await request(app.getHttpServer()).post(`/tasks/create`).set('Authorization', `Bearer ${access_token}`).send(taskDto).expect(HttpStatus.CREATED);
      taskId = res.body.id;
    });

    it("should not return an empty array", async () => {
      const res = await request(app.getHttpServer()).get(`/tasks/all`).expect(HttpStatus.OK);
      expect(res.body).not.toEqual([]);
    });

    it("should not edit a task if not authorized", () => {
      const dto: EditTaskDto = {
        id: taskId,
        content: "pepe",
        status: "COMPLETED"
      }
      return request(app.getHttpServer()).patch(`/tasks/edit`).send(dto).expect(HttpStatus.UNAUTHORIZED);
    });

    it("should edit a task if authorized", async () => {
      const dto: EditTaskDto = {
        id: taskId,
        content: "pepe",
        status: "COMPLETED"
      }

      const res = await request(app.getHttpServer()).patch(`/tasks/edit`).set('Authorization', `Bearer ${access_token}`).send(dto).expect(HttpStatus.OK);
      expect(res.body).toMatchObject(dto);
    });


    it("should not delete a task if not authorized", () => {
      const dto: DeleteTaskDto = {
        id: taskId
      }
      return request(app.getHttpServer()).delete(`/tasks/delete`).send(dto).expect(HttpStatus.UNAUTHORIZED);
    });

    it("should delete a task if authorized", () => {
      const dto: DeleteTaskDto = {
        id: taskId
      }

      return request(app.getHttpServer()).delete(`/tasks/delete`).set('Authorization', `Bearer ${access_token}`).send(dto).expect(HttpStatus.OK);
    });

    it("should return an empty array", async () => {
      const res = await request(app.getHttpServer()).get(`/tasks/all`).expect(HttpStatus.OK);
      expect(res.body).toEqual([]);
    });

  });


  describe("Collection", () => {
    let collectionId: number;
    it("Should not create collection if user is not logged", () => {
      return request(app.getHttpServer()).post(`/collections/export`).expect(HttpStatus.UNAUTHORIZED);
    });

    it("Should create collection if user is logged", async () => {
      const res = await request(app.getHttpServer()).post(`/collections/export`).set('Authorization', `Bearer ${access_token}`).expect(HttpStatus.CREATED);
      collectionId = res.body.id;
    });

    it("Should not import collection if user is not logged", () => {
      return request(app.getHttpServer()).post(`/collections/import`).expect(HttpStatus.UNAUTHORIZED);
    });

    it("Should import collection if user is logged", () => {
      const dto: ImportCollectionDto = {
        id: collectionId
      }
      return request(app.getHttpServer()).post(`/collections/import`).set('Authorization', `Bearer ${access_token}`).send(dto).expect(HttpStatus.OK);
    });

  });

});
