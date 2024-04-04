import {FirebaseProvider} from '../../src/lib/data/data_loader.firebase';
import {expect, test} from 'vitest';
import {connectFirestoreEmulator} from 'firebase/firestore';
import {db} from '../../src/lib/firebase/config';
// firebaseApps previously initialized using initializeApp()
connectFirestoreEmulator(db, '127.0.0.1', 8080);
test('getBudget', async () => {
  const id = '5Cg8LxiLqyRZAAuqWLGv';
  const budget = await FirebaseProvider.getBudget(id);
  expect(budget.budget_id === id);
});
