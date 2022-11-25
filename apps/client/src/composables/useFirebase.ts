import { FirebaseApp } from 'firebase/app';
import { Auth, User } from 'firebase/auth';

export default {
  app() {
    return useState<FirebaseApp | null>('useFirebaseApp', () => null);
  },
  auth() {
    return useState<Auth | null>('useFirebaseAuth', () => null);
  },
  user() {
    return useState<User | null>('useFirebaseUser', () => null);
  },
  checked() {
    return useState<boolean>('useFirebaseChecked', () => false);
  },
};
