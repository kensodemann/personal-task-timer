import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export const createCustomersServiceMock = () => {
  const mock = createFirestoreDataServiceMock();
  (mock as any).convertCustomers = jest.fn();
  return mock;
};
