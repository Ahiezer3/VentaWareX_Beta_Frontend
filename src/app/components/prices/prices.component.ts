import { Component } from '@angular/core';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { MyTableComponent } from '../my-table/my-table.component';
import { MyList } from '../../classes/MyList';
import { ProductPricesModel } from '../../models/productPrices.model';
import { NavigateToService } from '../../services/navigate-to.service';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';
import { SpinnerService } from '../../services/spinner.service';
import { MyTableInterface } from '../../interfaces/MyTableInterface';
import { PricesProductService } from '../../services/prices-product.service';
import { ToolService } from '../../services/tool.service';
import { PaginationService } from '../../services/pagination.service';
import { PaginationComponent } from '../pagination/pagination/pagination.component';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [MyHeaderComponent, MyTableComponent, PaginationComponent],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css',
  providers: [{ provide: 'MyTableInterface', useExisting: PricesComponent }]
})
export class PricesComponent extends MyList<ProductPricesModel> implements MyTableInterface{
  
  titlePage ="Precios";
  detailPage ="Lista de productos y sus precios";

  keys = [
    {
      key:"productName",
      columnName:"Producto"
    },
    {
      key:"keyProduct",
      columnName:"key producto"
    },
 
    {
      key:"basePriceFormat",
      columnName:"Costo"
    },
    {
      key:"listOneFormat",
      columnName:"Precio 1"
    },
    {
      key: "listTwoFormat",
      columnName:"Precio 2"
    },
    {
      key: "listThreeFormat",
      columnName:"Precio 3"
    },
    {
      key: "iepsFormat",
      columnName: "%IEPS"
    },
    {
      key: "ivaFormat",
      columnName: "%IVA"
    }
  ];

  constructor(service: PricesProductService, 
    myMenuService: MenuService,
    spinnerService: SpinnerService, 
    modalService: ModalService, 
    toastService: ToastService, 
    navigate: NavigateToService, 
    private tool:ToolService,
    paginationService: PaginationService) {
    super(service, spinnerService, modalService, toastService, navigate, paginationService, myMenuService);
  }

  ngOnInit() {

    this.onInit();

    this.setDataKey("keyProduct");
    this.setDataColumnNames(["Producto","keyProduct","Costo","Precio 1","Precio 2", "Precio 3", "IEPS", "IVA"]);
    this.setDataKeys(this.keys);
    this.addDataEditButton();
    this.setNext((res: { data: any[] }) => {

        let rows = res.data.filter((price: { product: { key: any; }; })=> {
          return price.product?.key != undefined;
        });

        
        rows = rows.map((row: ProductPricesModel) => {
          return {
            key: row.key,
            keyProduct: row.keyProduct,
            product: row.product,
 
            basePrice: row.basePrice,
            listOne: row.listOne,
            listTwo: row.listTwo,
            listThree: row.listThree,
            ieps: row.ieps,
            iva: row.iva,

            basePriceFormat: this.tool.formatNumber(row.basePriceTaxes,true),
            listOneFormat: this.tool.formatNumber(row.listOneTaxes,true),
            listTwoFormat: this.tool.formatNumber(row.listTwoTaxes,true),
            listThreeFormat: this.tool.formatNumber(row.listThreeTaxes,true),
            iepsFormat: this.tool.formatPercentNumber(row.ieps,true),
            ivaFormat: this.tool.formatPercentNumber(row.iva,true),
            productName: row.product?.name ?? ""
          };
        });

        return rows;

    });
  }

  override ngOnDestroy(): void {
      super.ngOnDestroy();
  }

  override edit(key: any): void {

    let url: string | undefined = "pricesProduct/"+key;

    this.navigateTo(url);
  }
}
