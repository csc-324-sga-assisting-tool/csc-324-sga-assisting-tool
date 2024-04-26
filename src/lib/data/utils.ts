import {User} from '.';

export function userIsSGA(user: User) {
  return (
    user.user_type === 'SGA_Treasurer' ||
    user.user_type === 'SGA_Assistant_Treasurer'
  );
}
