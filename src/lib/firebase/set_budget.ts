import {doc, setDoc, Firestore} from 'firebase/firestore';
import {Budget} from 'lib/data';
import {Collection} from './config';

/* push one new budget to firestore or overwrite the budget if it exists
 */
export async function addBudgetFirebase(
  budget_id: string,
  data: Budget,
  db: Firestore
): Promise<void> {
  return await setDoc(doc(db, Collection.Budgets, budget_id), data);
}
