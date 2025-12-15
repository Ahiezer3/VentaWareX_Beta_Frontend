import { Injectable } from '@angular/core';
import { MyService } from './myService.service';
import { SaleModel } from '../models/sale.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService extends MyService<SaleModel>{

  constructor(http: HttpClient) {
    super(http);
    this.setEndpoint('sales/');
  }

  getTotalByMonthForYear(year:number): Observable<any> {
    return this.myResponse(
      this.getHttpClient().get<SaleModel>(this.getUrlComplete()+"totalByMonthForYear/"+year)
    );
  }

  getTotalByDayCurrentMonth(month:number): Observable<any> {
    return this.myResponse(
      this.getHttpClient().get<SaleModel>(this.getUrlComplete()+"totalByDayCurrentMonth/"+month)
    );
  }

  getTotalByDayByDateRange(start:string, end:string): Observable<any> {
    return this.myResponse(
      this.getHttpClient().get<SaleModel>(this.getUrlComplete()+"totalByDayByDateRange/"+start+"&"+end)
    );
  }

}
