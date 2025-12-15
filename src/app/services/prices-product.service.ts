import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductPricesModel } from '../models/productPrices.model';
import { MyService } from './myService.service';

@Injectable({
  providedIn: 'root'
})
export class PricesProductService extends MyService<ProductPricesModel>{

  constructor(http: HttpClient) {
    super(http);
    this.setEndpoint('productPrices/');
  }

}
