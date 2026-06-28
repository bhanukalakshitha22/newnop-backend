import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { swaggerSpec } from './docs/swagger';
import { seedAdminIfEmpty } from './utils/seedAdmin';

async function bootstrap() {
  await connectDB();
  await seedAdminIfEmpty();

  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api', routes);

  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css',
      customJs: [
        'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js',
        'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
      ],
    }),
  );
  app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

  app.use(notFound);
  app.use(errorHandler);

  app.listen(env.port, () => {
    console.log(`[server] listening on http://localhost:${env.port}`);
    console.log(`[docs]   http://localhost:${env.port}/api/docs`);
  });
}

bootstrap().catch((err) => {
  console.error('[fatal]', err);
  process.exit(1);
});
