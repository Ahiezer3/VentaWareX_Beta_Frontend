import { Component } from '@angular/core';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { MyTableComponent } from '../my-table/my-table.component';
import { MyList } from '../../classes/MyList';
import { MyTableInterface } from '../../interfaces/MyTableInterface';
import { SaleModel } from '../../models/sale.model';
import { NavigateToService } from '../../services/navigate-to.service';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';
import { SpinnerService } from '../../services/spinner.service';
import { SaleService } from '../../services/sale.service';
import { ToolService } from '../../services/tool.service';
import { PaginationComponent } from '../pagination/pagination/pagination.component';
import { PaginationService } from '../../services/pagination.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [MyHeaderComponent, MyTableComponent, PaginationComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
  providers: [{ provide: 'MyTableInterface', useExisting: SalesComponent }]
})

export class SalesComponent extends MyList<SaleModel> implements MyTableInterface{

  menuService: any;

  titlePage ="Historial de ventas";
  detailPage ="Lista de ventas";

  keys = [
    {
      key:"customerName",
      columnName:"Cliente"
    },
    
    {
      key:"key",
      columnName:"Key"
    },
    {
      key:"keyCustomer",
      columnName:"Key Cliente"
    },

    {
      key:"listPrice",
      columnName:"Lista"
    },
    {
      key:"dateFormat",
      columnName:"Fecha"
    },
    {
      key:"totalProducts",
      columnName:"Productos"
    },
    {
      key:"subtotalFormat",
      columnName:"Subtotal"
    },
    {
      key:"iepsFormat",
      columnName:"%IEPS"
    },
    {
      key:"ivaFormat",
      columnName:"%IVA"
    },
    {
      key:"totalFormat",
      columnName:"Total"
    }
  ]

  constructor(service: SaleService, 
    myMenuService: MenuService,
    spinnerService: SpinnerService, 
    modalService: ModalService, 
    toastService: ToastService, 
    navigate: NavigateToService, 
    private tool: ToolService,
    paginationService: PaginationService) {
    super(service, spinnerService, modalService, toastService, navigate, paginationService, myMenuService);
    this.menuService = myMenuService;
  }

  ngOnInit() {

    this.onInit();

    if (!this.menuService.mobileScreen()) {
      this.setDataColumnNames(["Cliente", "key","Key Cliente","Lista", "Fecha", "Productos", "Subtotal", "IEPS", "IVA", "Total"]);
    } else {
      this.setDataColumnNames(["Cliente", "key","Lista", "Fecha", "Total"]);

      this.keys = [
        {
          key:"customerName",
          columnName:"Cliente"
        },
        
        {
          key:"key",
          columnName:"Key"
        },
        // {
        //   key:"keyCustomer",
        //   columnName:"Key Cliente"
        // },
    
        {
          key:"listPrice",
          columnName:"Lista"
        },
        {
          key:"dateFormat",
          columnName:"Fecha"
        },
        // {
        //   key:"totalProducts",
        //   columnName:"Productos"
        // },
        {
          key:"totalFormat",
          columnName:"Total"
        }
      ]

    }

    this.setDataKeys(this.keys);
    this.addDataEditButton();
    this.setNext((res: { data: SaleModel[] }) => {

        let rows = res.data.map((row: SaleModel) => {

          const list = this.tool.getDescriptionList(row?.listPrice);

          return {
            key: row.key,
            keyCustomer: row.keyCustomer,
            listPrice: list,
            date: row.date,
            totalProducts: row.totalProducts,
            subtotal: row.subtotal,
            iva: row.iva,
            ieps: row.ieps,
            total: row.total,
            customer: row.customer,
            customerName: row.customer?.name ?? "",

            dateFormat:this.tool.formatDate(new Date(row.date)),
            subtotalFormat: this.tool.formatNumber(row.subtotal,true),
            ivaFormat: this.tool.formatNumber(row.iva,true),
            iepsFormat: this.tool.formatNumber(row.ieps,true),
            totalFormat: this.tool.formatNumber(row.total,true),

          } as SaleModel;
        });

        return rows;

    });
  }

  override ngOnDestroy(): void {
      super.ngOnDestroy();
  }

  override edit(key: any): void {

    let url: string | undefined = "ticket/"+key;

    this.navigateTo(url);
  }

}
