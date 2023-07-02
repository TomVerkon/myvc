import { INestApplication, Session } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/users/user.entity';
import { Report } from '../src/reports/report.entity';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;
  let payload = { email: 'test@test.com', password: 'password' };
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'test.sqlite',
    synchronize: true,
    entities: [User, Report],
  });

  beforeEach(async () => {
    await dataSource.initialize();
    dataSource.manager.delete(User, {});

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterEach(async () => await dataSource.destroy());

  // signup(@Body() { email, password }: CreateUserDto, @Session() session: any)

  it('handles a signup request', async () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect(201)
      .then(res => {
        const { email, id } = res.body;
        expect(email).toEqual(email);
        expect(id).toBeDefined();
        return;
      });
    // .expect('Hello World!');
  });

  it('handles a signup request then get the currently logged in user', async () => {
    payload.email = 'test1@test.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect(201);
    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer()).get('/auth/whoami').set('Cookie', cookie).expect(200);
    expect(body.email).toEqual(payload.email);
  });
});
