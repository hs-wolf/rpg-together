import express, { Response as ExResponse, Request as ExRequest, NextFunction } from 'express';
import { generateHTML, serve } from 'swagger-ui-express';
import { ValidateError } from '@tsoa/runtime';
import cors from 'cors';
import { initializeApp, getApps, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp as initializeAppClient } from 'firebase/app';
import { ApiError } from '@rpg-together/models';
import { RegisterRoutes } from '../routes/routes';
import { firebaseConfig } from '../client-firebase-config';
import { ConnectMongoDB } from './mongodb';

if (!getApps().length) {
  initializeApp({
    credential: process.env.USE_DEFAULT_SERVICE_ACCOUNT === 'true' ? applicationDefault() : cert('firebase-keys.json'),
  });
  getFirestore().settings({ ignoreUndefinedProperties: true });
}

initializeAppClient(firebaseConfig);

ConnectMongoDB();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use('/docs', serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(generateHTML(await import('../spec/swagger.json'), { isExplorer: true }));
});
RegisterRoutes(app);
app.use(function errorHandler(err: unknown, req: ExRequest, res: ExResponse, next: NextFunction) {
  console.log(err);
  if (err instanceof ValidateError) {
    console.warn(`Caught validation error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: 'Validation failed.',
      details: err?.fields,
    });
  }
  if (err instanceof ApiError) {
    return res.status(err.status ?? err.code).json(err.toMap());
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: err?.message ?? 'Internal server error.',
    });
  }
  next();
});
const port = parseInt(process.env.PORT) || 3000;
const hostname = process.env.HOST || '0.0.0.0';
app.listen(port, hostname, () => {
  console.log(`\u001b[32mAPI being listened at: \u001b[1;32mhttp://localhost:${port}`);
});
