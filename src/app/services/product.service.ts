import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { MyService } from './myService.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends MyService<ProductModel>{

  constructor(http: HttpClient) {
    super(http);
    this.setEndpoint('products/');
  }

}
