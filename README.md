<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <h1 align="center">Krello</h1>
    <p align="center">
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
</p>

## Description

Krello is a backend project that you can use to create, manage, and share tasks.

Built using <b>Nest.js</b>, a Node.js framework, it offers an efficient and scalable way to build server-side applications.

The project uses <b>Postgresql</b>, a powerful open-source relational database management system, as its database. <b>Prisma</b>, a powerful ORM, handles the communication between the server and the database, providing a simple and performant way to interact with the data.

<b>Docker</b> to run the Postgresql database, making it easy to set up, run, and manage. By using Docker, you can run the database in a container that is isolated from the host machine, ensuring that the database is running in a consistent environment.

<b>Passport.js</b>, an authentication middleware for Node.js, handles authentication and authorization in the project. Users can register and login to the application easily.



## Installation

```bash
$ npm install
```

## Running the app

```bash
# development

# start the docker image and create the schemas
$ npm run db:dev:restart

# start the nestjs app
$ npm run start:dev

```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```