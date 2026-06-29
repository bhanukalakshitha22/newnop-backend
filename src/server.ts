import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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

  app.get('/api/docs', (_req, res) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' cdn.jsdelivr.net 'unsafe-inline'; style-src 'self' cdn.jsdelivr.net 'unsafe-inline'; img-src 'self' data:; worker-src blob:;",
    );
    res.send(`<!DOCTYPE html>
<html>
<head>
  <title>TaskFlow API</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
<script>
window.onload = function () {
  SwaggerUIBundle({
    url: '/api/docs.json',
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: 'StandaloneLayout',
  });
};
</script>
</body>
</html>`);
  });
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
