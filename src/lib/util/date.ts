// convert a number from 0 - 99 to a two digit string 00 - 99
function twoDigitString(num: number) {
  if (num < 10) {
    return `0${num}`;
  }
  return `${num}`;
}

// covert a date object into a en-US formatted string for typing into input
export function getMMDDYYYYTTTT(date: Date): string {
  const month = twoDigitString(date.getMonth());
  const dateMonth = twoDigitString(date.getDate());
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${month}${dateMonth}${year}${hour}${minute}`;
}
