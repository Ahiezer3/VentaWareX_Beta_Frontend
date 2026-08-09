import { Injectable } from '@angular/core';
import { SaleService } from './sale.service';
import { ToolService } from './tool.service';
import { map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardsService {

  constructor(private saleService:SaleService, private tool:ToolService) { }
  
  getTotalByMonthForYear(year:number): Observable<any> {
    // const year = new Date().getFullYear();
    return this.saleService.getTotalByMonthForYear(year).pipe(
      map((res: any) => {return this.createTotalByMonthForYear(res.data)}),
    );
  }

  getTotalByDayCurrentMonth(month:number): Observable<any> {

    let date = new Date();
    date.setMonth(month-1);
    date.setDate(1);

    return this.saleService.getTotalByDayCurrentMonth(month).pipe(
      map((res: any) => {return this.createTotalByDay(date,"Venta diaria en el mes",res.data)}),
    );
  }

  getTotalByDayByDateRange(startDate:string, endDate:string): Observable<any> {
    
    return this.saleService.getTotalByDayByDateRange(startDate, endDate).pipe(
      map((res: any) => {return this.createTotalByDay(new Date(),"Venta por fecha",res.data)}),
    );
  }

  createTotalByMonthForYear(data:any) {

    let labels:any[] = [];
    let valuesTotal:any[] = [];
    let valuesTotalGain:any[] = [];

    data.sort((a:any,b:any) => {
      if (a.month < b.month) return -1;
      if (a.month > b.month) return 1;
      return 0;
    });

    data.map((month:any) => {
      labels.push(this.tool.getNameMonth(month.month));
      valuesTotal.push(parseFloat(month.total));
      valuesTotalGain.push(parseFloat(month.totalGain));
    });

    return {
      labels:labels,
      values: {
        valuesTotal,
        valuesTotalGain
      }
    };
  }
  
  createTotalByDay(currentDate:Date, title:string,data:any) {

    let labels:any[] = [];
    let keys:any[] = [];
    let valuesTotal:any[] = [];
    let valuesTotalGain:any[] = [];

    data.sort((a: any, b: any) => {
      return String(a.day).localeCompare(String(b.day));
    });

    data.map((date:any) => {

      const rawDate = String(date.day ?? date.date).slice(0, 10);
      const parts = rawDate.split('-');
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);

      keys.push(rawDate);
      labels.push(new Date(year, month, day).toLocaleDateString());
      valuesTotal.push(parseFloat(date.total).toString());
      valuesTotalGain.push(parseFloat(date.totalGain).toString());
      
    });
 	
    return {
      labels: labels,
      keys: keys,
      values: {
        valuesTotal,
        valuesTotalGain
      }
    };
  }

  generateYearsFilter() {

    const currentYear = new Date().getFullYear();
    const years:any[] = [];
    
    for (let i = 0; i < 4; i++) {
      years.push(currentYear - i);
    }
    
    return years;
  }

}
