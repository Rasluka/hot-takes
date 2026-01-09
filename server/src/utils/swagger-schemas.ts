/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: User unique identifier
 *           example: 1
 *         nickname:
 *           type: string
 *           description: User display name
 *           example: "john_doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *           example: "user@example.com"
 *         role:
 *           $ref: '#/components/schemas/Role'
 *       required:
 *         - id
 *         - nickname
 *         - email
 *         - role
 *     UserDto:
 *       type: object
 *       properties:
 *         nickname:
 *           type: string
 *           description: User display name
 *           example: "john_doe"
 *           minLength: 3
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *           example: "user@example.com"
 *         roleId:
 *           type: integer
 *           description: User role ID (required for admin creation)
 *           example: 2
 *       required:
 *         - nickname
 *         - email
 *     UserSignInDto:
 *       type: object
 *       properties:
 *         nickname:
 *           type: string
 *           description: User display name
 *           example: "john_doe"
 *         code:
 *           type: string
 *           description: 8-digit authentication code
 *           example: "12345678"
 *           pattern: '^[0-9]{8}$'
 *       required:
 *         - nickname
 *         - code
 *     UserSignInResult:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: JWT authentication token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     UserCreationResult:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         code:
 *           type: string
 *           description: 8-digit verification code sent to email
 *           example: "12345678"
 *         emailSent:
 *           type: boolean
 *           description: Whether email was successfully sent
 *           example: true
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Role unique identifier
 *           example: 1
 *         name:
 *           type: string
 *           description: Role name
 *           example: "admin"
 *     Take:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Take unique identifier
 *           example: 1
 *         content:
 *           type: string
 *           description: Take content text
 *           example: "This is my hot take on..."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Take creation timestamp
 *           example: "2024-01-06T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Take last update timestamp
 *           example: "2024-01-06T10:00:00Z"
 *         createdBy:
 *           type: integer
 *           description: ID of user who created the take
 *           example: 1
 *     FavoriteTake:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Favorite unique identifier
 *           example: 1
 *         userId:
 *           type: integer
 *           description: User who favorited the take
 *           example: 1
 *         takeId:
 *           type: integer
 *           description: Favorited take ID
 *           example: 1
 *         take:
 *           $ref: '#/components/schemas/Take'
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Operation success status
 *           example: true
 *         data:
 *           description: Response data (can be object, array, or null)
 *           oneOf:
 *             - type: object
 *             - type: array
 *             - type: 'null'
 *         message:
 *           type: string
 *           description: Operation result message
 *           example: "Operation completed successfully"
 *       required:
 *         - success
 *         - message
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Operation success status
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error description
 *               example: "Bad Request: Invalid input"
 *             code:
 *               type: string
 *               description: Error code identifier
 *               example: "BAD_REQUEST"
 *       required:
 *         - success
 *         - error
 *     ValidationError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Validation failed"
 *             details:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   field:
 *                     type: string
 *                     example: "email"
 *                   message:
 *                     type: string
 *                     example: "Invalid email format"
 *               example:
 *                 - field: "email"
 *                   message: "Invalid email format"
 */
