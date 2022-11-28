import { FirebaseApp } from 'firebase/app';
import { Auth, User } from 'firebase/auth';

export default {
  firebaseApp() {
    return useState<FirebaseApp | null>('useFirebaseFirebaseApp', () => null);
  },
  firebaseAuth() {
    return useState<Auth | null>('useFirebaseFirebaseAuth', () => null);
  },
  currentUser() {
    return useState<User | null>('useFirebaseCurrentUser', () => null);
  },
  checkedFirstTime() {
    return useState<boolean>('useFirebaseCheckedFirstTime', () => false);
  },
};
