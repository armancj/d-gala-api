# d-gala-api

Backend for a social commerce platform — a product catalogue and an order flow living inside a
social feed — built with **NestJS**, **TypeScript**, **PostgreSQL/Prisma** and **Elasticsearch**.

Users have profiles, publish posts with comments and categories, and sell products with photos,
colours, reviews and orders. Full-text search runs on Elasticsearch, images are stored in S3-
compatible object storage, and the whole environment comes up with a single `docker compose up`.

**175** TypeScript source files · 16 Prisma models · 4 backing services orchestrated in Compose.

---

## What it covers

### A domain that is actually two products at once

| Area | Models |
|---|---|
| Social | `Post`, `Comment`, `Category`, `CategoriesOnPosts`, `PrivateMessage` |
| Commerce | `Product`, `Colors`, `Photo`, `Review`, `Order`, `OrderItem` |
| Identity | `User`, `Profile`, `EmailConfirmed`, `PhoneConfirmed`, `Logs` |

with `Role`, `UserStatus`, `EmailStatus`, `ProductStatus` and `GenderType` as enums. The
many-to-many between posts and categories is modelled explicitly (`CategoriesOnPosts`) so the join
can carry its own data.

### Verified sign-up

Registration is not just a row in `User`. Email and phone are confirmed independently
(`EmailConfirmed`, `PhoneConfirmed`) with generated pin codes and templated transactional mail, and
account state is tracked through `UserStatus` / `EmailStatus` rather than a boolean.

### Search as a separate concern

The `search` module indexes into **Elasticsearch** with its own controller, service, DTOs and
config, keeping full-text queries out of the Prisma layer instead of degrading into `LIKE '%...%'`.

### Object storage, not the filesystem

Product photos go to **MinIO** through `nestjs-minio-client`, so the API stays stateless and the
same code path works against any S3-compatible bucket in production.

---

## Stack

| Area | Technology |
|---|---|
| Framework | NestJS 9, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Search | Elasticsearch (`@nestjs/elasticsearch`) |
| Object storage | MinIO (S3-compatible) |
| Cache | `@nestjs/cache-manager`, Redis |
| Auth | Passport (local + JWT), bcrypt, role-based guards |
| Validation | class-validator, class-transformer, Joi (env schema) |
| Security | Helmet |
| Mail | `@nestjs-modules/mailer` + Pug / EJS / Handlebars templates |
| Logging | Winston (`nest-winston`) |
| Events | `@nestjs/event-emitter` |
| API docs | Swagger |
| Testing | Jest, Supertest |

## Architecture

```
src/
  auth/      Login, JWT strategies, guards, role-based access
  user/      Users, profiles, email/phone confirmation
  store/     The domain: products, categories, colors, posts, reviews, search
  files/     Uploads
  minio/     S3-compatible object storage client
  mailer/    Transactional mail with templates
  prisma/    Prisma service and client wiring
  seed/      Seed data
  logger/    Winston setup
  config/    Joi-validated configuration
  common/    Shared decorators, filters, DTOs
```

## Getting started

Everything the API needs — PostgreSQL, MinIO, Elasticsearch and Redis — is defined in
`docker-compose.yaml`:

```bash
docker compose up -d
yarn install
npx prisma migrate deploy
yarn start:dev
```

Swagger UI is served once the app is running (`src/app.swagger.ts`). Configuration is validated at
boot with a Joi schema, so a missing variable fails fast instead of at first use.

## Testing

```bash
yarn test         # unit
yarn test:e2e     # end to end
yarn test:cov     # coverage report
```

## Deployment

A `Dockerfile` builds the API image and `run-d-gala.sh` wraps the container startup.
