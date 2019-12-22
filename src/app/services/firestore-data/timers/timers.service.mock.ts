import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export function createTimersServiceMock() {
  const mock = createFirestoreDataServiceMock();
  (mock as any).start = jest.fn(() => Promise.resolve());
  (mock as any).stop = jest.fn(() => Promise.resolve());
  return mock;
}
