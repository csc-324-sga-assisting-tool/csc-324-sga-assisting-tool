import {User, Comment} from '.';

export function userIsSGA(user: User) {
  return (
    user.user_type === 'SGA_Treasurer' ||
    user.user_type === 'SGA_Assistant_Treasurer'
  );
}

let commentIdTracker = 0;
export function createComment(userId: string, comment: string): Comment {
  return {
    id: `${userId}_${commentIdTracker++}`,
    userId,
    comment,
  };
}
