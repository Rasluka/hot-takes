# Project Structure

```
my-express-api/
src/
├── controllers/
│   ├── user.controller.ts
│   ├── auth.controller.ts
│   └── post.controller.ts

├── services/
│   ├── user.service.ts
│   ├── auth.service.ts
│   └── post.service.ts

├── models/
│   ├── user.model.ts
│   ├── post.model.ts
│   └── role.model.ts

├── routes/
│   ├── user.routes.ts
│   ├── auth.routes.ts
│   └── post.routes.ts

├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validate.middleware.ts

├── config/
│   ├── db.config.ts
│   └── env.config.ts

├── utils/
│   ├── prisma.util.ts
│   ├── logger.util.ts
│   └── response.util.ts

└── app.ts
```
