import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export const createTimersServiceMock = () => {
  const mock = createFirestoreDataServiceMock();
  (mock as any).start = jest.fn(() => Promise.resolve());
  (mock as any).stop = jest.fn(() => Promise.resolve());
  return mock;
};
