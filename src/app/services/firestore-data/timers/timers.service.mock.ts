import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export function createTimersServiceMock() {
  const mock = createFirestoreDataServiceMock();
  return mock;
}
