import swaggerJSDoc from 'swagger-jsdoc';
import { env } from '../config/env';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description:
        'Task Management System REST API. Supports JWT auth, role-based access (admin/user), and full CRUD on tasks.',
    },
    servers: [{ url: `http://localhost:${env.port}`, description: 'Local dev' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'user'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', minLength: 6, example: 'secret123' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            password: { type: 'string', example: 'Admin@123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
            status: { type: 'string', enum: ['Open', 'In Progress', 'Testing', 'Done'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            createdBy: { $ref: '#/components/schemas/User' },
            assignedTo: { $ref: '#/components/schemas/User', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateTaskInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Write project README' },
            description: { type: 'string', example: 'Cover setup, env, scripts and deployment' },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'], example: 'High' },
            status: {
              type: 'string',
              enum: ['Open', 'In Progress', 'Testing', 'Done'],
              example: 'Open',
            },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            assignedTo: { type: 'string', description: 'User ObjectId' },
          },
        },
        UpdateTaskInput: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
            status: { type: 'string', enum: ['Open', 'In Progress', 'Testing', 'Done'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            assignedTo: { type: 'string', nullable: true },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Registration, login, and current user' },
      { name: 'Tasks', description: 'CRUD with role-aware visibility' },
      { name: 'Users', description: 'Admin-only user listing' },
    ],
  },
  apis: ['./src/routes/*.ts'],
});
