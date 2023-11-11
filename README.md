# GEM STORE

Gem Store is a gaming platform with an in-game currency system built using TypeScript and Nest.js, designed to scale horizontally with ease.

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
 nest start gateway --watch
 nest start user --watch
 nest start ledger --watch
 ```

Ensure that the ports specified in your .env file match the ones used above. You should be able to access the API docummentation of the application at: http://localhost:3000/document#/


## Technical Features
- Langauge: TypeScript
- 3 NestJS microservices as Monorepo
- API Gateway (HTTP to RabbitMQ messages)
- Using RabbitMQ as transports protocol
- Postgres as database
- JWT authentication
- Everything Dockerized
- Using double-entry accounting technique
- API documentation with Swagger

## Endpoints

### Users
`POST /api/users/register`: Register a new user with email and password

`POST /api/users/login`: Authenticate user for JWT token.

`GET /api/users/me`: Retrieve current user information.

### Ledgers
`GET /api/ledgers`: List all user ledgers.

`POST /api/ledgers/transfer`: Transfer asset (GEM) to specific user email.

`GET /api/ledgers/entries`: Query the ledger entries for transaction history.

