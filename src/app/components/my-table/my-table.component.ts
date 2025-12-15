import { CommonModule } from '@angular/common';
import { Component, Inject, Input, Optional } from '@angular/core';
import { MyTableService } from '../../services/my-table.service';
import { MyTableInterface } from '../../interfaces/MyTableInterface';

@Component({
  selector: 'app-my-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-table.component.html',
  styleUrl: './my-table.component.css'
})
export class MyTableComponent {

  @Input() data:any = {
    key:"",
    columnNames:[],
    keys:[],
    rows:[]
  };

  constructor(@Optional() @Inject('MyTableInterface') private myTableInterface: MyTableInterface) {

  }

  ngOnInit(): void {
    
    if (!(this.data && this.data.columnNames && this.data.columnNames.length > 0)) {
      this.MyTableDummy();
    }

  }

  edit(key: any): void {
    this.myTableInterface.edit(key);
  }

  save(key: any): void {
    this.myTableInterface.save(key);
  }

  delete(key: any): void {
    this.myTableInterface.delete(key);
  }

  private MyTableDummy(): void {
    // Example to crete data for MyTable

    this.data.key = "column1";
    this.data.columnNames = ["Columna 1", "Columna 2", "Columna 3"];
    this.data.keys = ["column1","column2","column3"];

    this.data.buttons = [
      {
        type:"edit",
        text:"Editar"
      },
      {
        type:"save",
        text:"Guardar"
      },
      {
        type:"delete",
        text:"Borrar"
      }
    ];

    this.data.rows = [
      {
        column1: 1,
        column2: 2,
        column3: 3
      },
      {
        column1: 10,
        column2: 20,
        column3: 30
      }
    ];
  }

}
