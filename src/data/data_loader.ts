import {Budget} from './data_types';

function getBudget(budget_id: string): Budget {
  // TODO: Implement using Firebase
  //STUB
  return {
    user_id: '000',
    budget_id: budget_id,
    event_name: 'STUB',
    total_cost: 0,
    current_status: 'created',
    status_history: [],
    items: [],
  };
}

export {getBudget};
