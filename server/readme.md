# Hot Takes Server

A Node.js/Express API server for managing hot takes with user authentication and favorites functionality.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory with the following variables:

```
DB_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=your_email_host
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

### 3. Database Setup

#### Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Push database schema to PostgreSQL
npx prisma db push

# View database
npx prisma studio

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

#### Test Database

```bash
# Push schema to test database
npm run db:push:test
```

### 4. Running the Application

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start

# Build TypeScript
npm run build
```

### 5. Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

## Project Structure

```
project/
src/
├── controllers/
│   ├── user.controller.ts
│   ├── auth.controller.ts
│   ├── take.controller.ts
│   ├── role.controller.ts
│   └── favorite-take.controller.ts

├── services/
│   ├── user.service.ts
│   ├── auth.service.ts
│   ├── take.service.ts
│   ├── role.service.ts
│   ├── favorite-take.service.ts
│   ├── email.service.ts
│   └── user.creation.ts

├── middleware/
│   ├── auth-token.middleware.ts
│   ├── check-role.middleware.ts
│   └── error-handler.middleware.ts

├── routes/
│   ├── user.route.ts
│   ├── auth.route.ts
│   ├── take.route.ts
│   ├── role.route.ts
│   └── favorite-take.route.ts

├── errors/
│   ├── app.error.ts
│   ├── bad-request.error.ts
│   ├── conflict.error.ts
│   ├── not-found.error.ts
│   └── unauthorized.error.ts

├── utils/
│   ├── api-response.util.ts
│   ├── async-wrapper.util.ts
│   ├── format-user.util.ts
│   ├── generate-code.util.ts
│   ├── generate-token.util.ts
│   └── logger.util.ts

├── types/
│   ├── auth-request.ts
│   ├── role.ts
│   ├── take.ts
│   └── user.ts

├── templates/
│   └── code-email.html

├── __tests__/
│   ├── controllers/
│   ├── services/
│   ├── integration/
│   └── setup/

├── app.ts
├── server.ts
└── prisma.ts

prisma/
├── migrations/
└── schema.prisma
```

# Naming convention

Where:

```
[feature].[layer].ts
```

[feature] → the domain or entity (e.g., role, favorite-take)

[layer] → type of file (e.g., service, controller, repository)
