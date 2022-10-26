import { initializeApp, getApps, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import app from './app';

if (!getApps().length) {
  initializeApp({
    credential: process.env.USE_DEFAULT_SERVICE_ACCOUNT === 'true' ? applicationDefault() : cert('firebase-keys.json'),
  });
  getFirestore().settings({ ignoreUndefinedProperties: true });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`\u001b[32mAPI being listened at: \u001b[1;32mhttp://localhost:${port}`);
});
