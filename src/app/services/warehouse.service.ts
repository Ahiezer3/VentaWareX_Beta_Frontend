import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor() { }

  edit(key: any): void {
    console.log("Editando: ",key);
  }
  save(key: any): void {
    console.log("Guardando: "+key);
  }
  delete(key: any): void {
    console.log("Borrando: "+key);
  }

}
