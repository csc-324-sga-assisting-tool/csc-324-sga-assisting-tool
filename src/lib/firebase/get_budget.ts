import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';
import {Budget} from 'lib/data';
import {Collections} from './config';

/* getUserBudgets returns 'howMany' of the userID's most recent budgets
 */
async function getUserBudgetsFirebase(
  userID: string,
  howMany: number,
  db: Firestore
): Promise<Budget[]> {
  const budgets: Budget[] = [];

  const q = query(
    collection(db, Collections.Budgets),
    where('user_id', '==', userID),
    limit(howMany)
  );
  const result = await getDocs(q);
  result.forEach(doc => {
    const data = doc.data() as Budget;
    budgets.push(data);
  });
  return budgets;
}

/* getBudget returns a specific budget
 */
async function getBudgetFirebase(
  budget_id: string,
  db: Firestore
): Promise<Budget | undefined> {
  const result = await getDoc(doc(db, Collections.Budgets, `${budget_id}`));
  const budget: Budget = result.data() as Budget;
  return budget;
}

export {getBudgetFirebase, getUserBudgetsFirebase};
