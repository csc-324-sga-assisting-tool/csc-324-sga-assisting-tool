import {
  collection,
  doc,
  setDoc,
  Firestore,
  limit,
  query,
  where,
  addDoc,
} from 'firebase/firestore';
import {Budget, Item} from 'lib/data';
import {Collection} from './config';

/* push one new budget to firestore or overwrite the budget if it exists
 */

export async function addBudgetFirebase(
  budget_id: string,
  db: Firestore,
  data: Budget
) {
  await setDoc(doc(db, Collection.Budgets, budget_id), data);
}

export async function addBudgetFirebaseNoId(
  db: Firestore,
  data: Budget
): Promise<string> {
  const budget_id = await addDoc(collection(db, Collection.Budgets), data);
  return budget_id.id;
}
