import { EMPTY } from 'rxjs';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';

export function createFirestoreDataServiceMock() {
  return {
    observeChanges: jest.fn(() => EMPTY),
    get: jest.fn(() => Promise.resolve()),
    add: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve()),
    getCollection: jest.fn(() => undefined)
  };
}
