# GEM STORE

Gem Store is an in-game currency platform designed to allow users to register, authenticate, transfer GEM to another user, and manage their ledgers. Built with TypeScript, with the technical blueprint to follow microservice best practices to ensure a scalable and efficient architecture, leverages RabbitMQ as the transport protocol to facilitate communication between services.

## Technical Features
- 💜 Langauge: TypeScript
- 🔥 3 NestJS microservices as Monorepo
- 🚪 API Gateway (HTTP to RabbitMQ messages)
- 🐇 Using RabbitMQ as transports protocol
- 💿 Postgres as database
- 🔑 JWT authentication
- 📦 Everything Dockerized
- 📖 Using double-entry accounting technique
- 🔢 API pagination (limit & page as query params)
- 📚 API documentation with Swagger
- 👀 Observability technique using OpenTelemetry

## Project Structure
The project is organized as follows:

```
├── apps
│   ├── gateway - API gateway for managing incoming HTTP requests.
│   ├── ledger - Microservice managing in-game currency transactions.
│   └── user - Microservice handling user-related operations.
├── libs
│   ├── authentication - Guards and decorators for user authentication.
│   ├── common - Shared utilities and constants.
│   ├── database - Manages database connections and queries.
│   ├── observability - Distributed request tracing and exporter to Jeager
│   ├── rabbit - Provides RabbitMQ integration.
│   └── token - Manages database connections and queries.
├── docker-compose.yaml
```

## Installation
1. Copy .env.example to .env
```bash
cp .env.example .env
```
2. Install Dependencies
```bash
npm i
```

 ## Run

 With Docker compose
 ```bash
 docker-compose up
 ```

 With local node.js
 ```bash
 npm install -g @nestjs/cli

 nest start gateway --watch
 nest start user --watch
 nest start ledger --watch
 ```

Ensure that the ports specified in your .env file match the ones used above.

## API Documentation
Once the project is up and running, you should be able to access the API docummentation of the application at: http://localhost:3000/document#/

## Debugging
For debugging, you can also access http://localhost:16686/ to monitor the request with Jeager

## Run E2E Test

Ensure to start all services before run an E2E test.

```bash
npm run test:e2e
```

## API Endpoints

### Users
`POST /api/users/register` - Register a new user with email and password
```bash
curl --location 'http://localhost:3000/api/users/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "john@wick.co",
  "password": "ThisIsJohn"
}'
```

`POST /api/users/login` - Authenticate user for JWT token.
```bash
curl --location 'http://localhost:3000/api/users/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "john@wick.co",
  "password": "ThisIsJohn"
}'
```

`GET /api/users/me` - Retrieve current user information.
```bash
curl --location --request GET 'http://localhost:3000/api/users/me' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <TOKEN>'
```

### Ledgers
`GET /api/ledgers` - List all user ledgers.
```bash
curl --location --request GET 'http://localhost:3000/api/ledgers' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <TOKEN>'
```

`POST /api/ledgers/transfer` - Transfer asset (GEM) to specific user's email.
```bash
curl --location 'http://localhost:3000/api/ledgers/transfer' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <TOKEN>'
--data-raw '{
  "email": "jane@wick.co",
  "amount": 10.25,
  "currency": "GEM"
}'
```

`GET /api/ledgers/entries`: Query the ledger entries for transaction history.
```bash
curl --location 'http://localhost:3000/api/ledgers/entries?type=debit&limit=50&page=1&currency=gem' \
--header 'Authorization: Bearer <TOKEN>'
```

## License
MIT