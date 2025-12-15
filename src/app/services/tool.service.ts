import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor() { }

  formatNumber(value: any, simbol:boolean): string {

    let simbolCurrency: string = simbol ? "$" : "";

    if (value == null || value == undefined) {
      value = 0;
    }
  
    value = Number(value);
  
    if (isNaN(value)) {
      value = 0;
    }
  
    return simbolCurrency + value.toFixed(2);
  }

  formatCurrency(number:number) {

    // Formatear como moneda en dólares con comas y dos decimales
    const formattedTotal = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(number);

    return formattedTotal;

  }

  formatPercentNumber(value: any, simbol:boolean): string {

    let simbolCurrency: string = simbol ? "%" : "";

    if (value == null || value == undefined) {
      value = 0;
    }
  
    value = Number(value);
  
    if (isNaN(value)) {
      value = 0;
    }
  
    return value.toFixed(2)+simbolCurrency;
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0 a 11
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  getDescriptionList(keyList:string | undefined) {
    return (keyList && keyList == "listOne") ? "Lista 1" :
          (keyList && keyList == "listTwo") ? "Lista 2" :
          (keyList && keyList == "listThree") ? "Lista 3" : "";
  }

  getNameMonth(numberMonth:number) {

    if (isNaN(numberMonth)) {
      return "Desconocido";
    }

    switch(numberMonth) {

      case 1:
        return "Enero";

      case 2:
        return "Febrero";

      case 3:
        return "Marzo";

      case 4:
        return "Abril";

      case 5:
        return "Mayo";

      case 6:
        return "Junio";

      case 7:
        return "Julio";

      case 8:
        return "Agosto";

      case 9:
        return "Septiembre";

      case 10:
        return "Octubre";

      case 11:
        return "Noviembre";

      case 12:
        return "Diciembre";

      default :
        return "Desconocido";
    }
  }

  convertDateToUtc(date:Date) {
    const dateUtc = date ? new Date(date.getTime() + date.getTimezoneOffset() * 60000) : null;

    return dateUtc;
  }

  calculateUnitySubtotal(totalPrice:number, ivaPercentage:number, iepsPercentage:number): number {
    
    let unityTotalIva:number = 0;
    let subtotalWithoutIva:number = 0;
    let unityTotalIeps:number = 0;
    let unitySubtotal:number = 0;

    if (Number(ivaPercentage) != 0 ) {
      unityTotalIva = Number(Number(totalPrice) * Number(Number(ivaPercentage) / Number(100 + Number(ivaPercentage))));
      subtotalWithoutIva = Number(Number(totalPrice) - Number(unityTotalIva))
    } else {
      unityTotalIva = Number(totalPrice);
      subtotalWithoutIva = Number(unityTotalIva);
    }

    if (Number(iepsPercentage) != 0) {
      unityTotalIeps =  Number(Number(subtotalWithoutIva) * Number(Number(iepsPercentage) / Number(100 + Number(iepsPercentage))));
      unitySubtotal = Number(Number(subtotalWithoutIva) - Number(unityTotalIeps));
    } else {
      unityTotalIeps = Number(subtotalWithoutIva);
      unitySubtotal = Number(unityTotalIeps);
    }
    
    return unitySubtotal;

  }

  stringToBoolean(value:any):boolean{

    if (typeof value == 'string') {
      return value == 'true' ? true : false;
    } else {
      return value;
    }
  }

  loadToFormat(value:string):string {
    return value == "product" ? "Producto" : "Envase";
  }

  getClearUrl(url:string) {
    
    if (!url) {
      return "";
    }

    let urlClearArray = url.split('/');
    let urlClear = urlClearArray[1];
    urlClearArray = urlClear.split('?');
    urlClear = urlClearArray.length > 0 ? urlClearArray[0] : urlClear;

    return urlClear;
  }
}
