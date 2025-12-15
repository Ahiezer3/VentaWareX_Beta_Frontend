import { Injectable } from '@angular/core';
import { CustomerModel } from '../models/customerModel';
import { HttpClient } from '@angular/common/http';
import { MyService } from './myService.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends MyService<CustomerModel>{

  constructor(http: HttpClient) {
    super(http);
    this.setEndpoint('customers/');
  }
}
