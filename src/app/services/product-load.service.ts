import { Injectable } from '@angular/core';
import { MyService } from './myService.service';
import { HttpClient } from '@angular/common/http';
import { ProductLoad } from '../models/productLoad';
import { Observable } from 'rxjs';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductLoadService extends MyService<ProductLoad>{

  constructor(http: HttpClient, private productService: ProductService) {
    super(http);
    this.setEndpoint('productLoads/');
  }

  getProduct(id:number): Observable<any> {
    return this.productService.find(id);
  }

  loads(id:number | undefined, page:string, limit:string): Observable<any> {
    return this.myResponse(
      this.getHttpClient().get<ProductLoad>(this.getUrlComplete()+"loads/"+id+"?page="+page+"&limit="+limit)
    );
  }

}
