import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { TabsProductComponent } from '../tabs-product/tabs-product.component';
import { CommonModule } from '@angular/common';
import { MyHeaderComponent } from '../../my-header/my-header.component';
import { MyTableComponent } from '../../my-table/my-table.component';

@Component({
  selector: 'app-existences-product',
  standalone: true,
  imports: [TabsProductComponent, CommonModule, MyHeaderComponent, MyTableComponent],
  templateUrl: './existences-product.component.html',
  styleUrl: './existences-product.component.css'
})
export class ExistencesProductComponent  implements AfterViewInit{

  @ViewChild(TabsProductComponent) tabs!: TabsProductComponent;

  titlePage = "Existencias";
  detailPage = "Existencia actual para el producto e historial de cargas al inventario.";

  
  stockHistoryLoad: any[] = [];

  data:any = {
    key:"sku",
    columnNames:["Fecha", "Tipo de carga", "Existencia actual", "Carga", "Nueva existencia"],
    keys:[
      "date",
      "loadType",
      "currentStock",
      "quantityLoad",
      "newQuantityLoad"],
    rows:[]
  };

  constructor() {}
  
  ngAfterViewInit(): void {
    this.tabs.activateTab("tabExistencesProduct");
  }
;

  ngOnInit() {
    // Simula la carga de datos
  
    this.stockHistoryLoad = [
      {
        sku: "1",
        date : new Date().toISOString(),
        loadType : "Incremento",
        currentStock : 10,
        quantityLoad : 10,
        newQuantityLoad : 10
      },
      {
        sku: "2",
        date : new Date().toISOString(),
        loadType : "Incremento",
        currentStock : 10,
        quantityLoad : 10,
        newQuantityLoad : 10
      },
      {
        sku: "3",
        date : new Date().toISOString(),
        loadType : "Incremento",
        currentStock : 10,
        quantityLoad : 10,
        newQuantityLoad : 10
      }
    ];
    
    this.data.rows = this.stockHistoryLoad;
  }

}
