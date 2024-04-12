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
import {Item} from 'lib/data';
import {Collections} from './config';

/* getUserBudgets returns 'howMany' of the userID's most recent budgets
 */
async function getBudgetItems(
  budgetID: string,
  howMany: number,
  db: Firestore
): Promise<Item[]> {
  const items: Item[] = [];

  const q = query(
    collection(db, Collections.Items),
    where('budget_id', '==', budgetID),
    limit(howMany)
  );
  const result = await getDocs(q);
  result.forEach(doc => {
    const data = doc.data() as Item;
    items.push(data);
  });
  return items;
}

export {getBudgetItems};
