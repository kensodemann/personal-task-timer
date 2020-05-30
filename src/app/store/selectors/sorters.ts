import { Customer, Timer } from '@app/models';

export const byDate = (t1: Timer, t2: Timer) => {
  if (t1.date > t2.date) {
    return -1;
  }
  if (t1.date < t2.date) {
    return 1;
  }
  return 0;
};

export const byName = (c1: Customer, c2: Customer) => {
  const name1 = c1.name.toLowerCase();
  const name2 = c2.name.toLowerCase();
  if (name1 < name2) {
    return -1;
  }
  if (name1 > name2) {
    return 1;
  }
  return 0;
};
