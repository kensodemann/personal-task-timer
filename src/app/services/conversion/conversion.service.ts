import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take, timestamp } from 'rxjs/operators';

import { Timer } from '@app/models';
import { CustomersService, TimersService } from '../firestore-data';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {
  constructor(private customersService: CustomersService, private timersService: TimersService) {}

  customers(user: firebase.User) {
    this.allTimers(user)
      .pipe(take(1))
      .subscribe(async timers => {
        const ids = await this.createRequiredCustomers(timers);
        timers.forEach(timer => {
          if (timer.customer) {
            this.timersService.update({
              ...timer,
              customerName: timer.customer,
              customerId: ids.get(timer.customer),
              customer: null
            });
          }
        });
      });
  }

  reset(user: firebase.User) {
    this.allTimers(user)
      .pipe(take(1))
      .subscribe(timers => {
        timers.forEach(timer => {
          if (!timer.customer) {
            this.timersService.update({ ...timer, customer: timer.customerName, customerId: null, customerName: null });
          }
        });
      });
  }

  private async createRequiredCustomers(timers: Array<Timer>): Promise<Map<string, string>> {
    const adds = [];
    const customers = this.mapUniqueCustomers(timers);
    const customerIds = new Map();
    customers.forEach(customer => {
      adds.push(this.customersService.add({ name: customer }).then(res => customerIds.set(customer, res.id)));
    });
    await Promise.all(adds);
    return customerIds;
  }

  private mapUniqueCustomers(timers: Array<Timer>): Map<string, string> {
    const customers = new Map();
    timers.forEach(timer => {
      if (timer.customer) {
        customers.set(timer.customer, timer.customer);
      }
    });
    return customers;
  }

  private allTimers(user: firebase.User): Observable<Array<Timer>> {
    return this.timersService
      .getCollection(user)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Timer;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
}
