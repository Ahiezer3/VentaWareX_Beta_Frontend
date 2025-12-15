import { Component } from '@angular/core';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { MyTableComponent } from '../my-table/my-table.component';
import { MyTableInterface } from '../../interfaces/MyTableInterface';
import { ProductService } from '../../services/product.service';
import { SpinnerService } from '../../services/spinner.service';
import { ToastService } from '../../services/toast.service';
import { NavigateToService } from '../../services/navigate-to.service';
import { ProductModel } from '../../models/product.model';
import { ModalService } from '../../services/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { PaginationComponent } from '../pagination/pagination/pagination.component';
import { PaginationService } from '../../services/pagination.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [MyHeaderComponent, MyTableComponent, PaginationComponent],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.css',
  providers: [{ provide: 'MyTableInterface', useExisting: WarehouseComponent }]
})

export class WarehouseComponent implements MyTableInterface {

  private distroySuscriptions$: Subject<void> = new Subject<void>();

  limit: string = "20";
  
  titlePage ="Inventario";
  detailPage ="Lista de productos en inventario y existencias";
  productId: number | undefined;

  addNewItemText = this.menuService.mobileScreen() ? "+" : "Agregar";

  data:any = {
    key:"key",
    columnNames:["Nombre", "Key","Sku","Existencia", "Existencia envase"],
    keys:[
      {
        key:"name",
        columnName: "Nombre"
      },
      {
        key:"key",
        columnName:"key"
      },
      {
        key:"sku",
        columnName:"sku"
      },
      {
        key:"existence",
        columnName:"Existencia"
      },
      {
        key:"existenceReturn",
        columnName:"Existencia envase"
      }
      ],
      buttons : [
        {
          type:"edit",
          text:"Editar"
        },
        {
          type:"delete",
          text:"Borrar"
        }
      ],
      rows: []
  };

  constructor(private service: ProductService, 
    private menuService: MenuService,
    private spinnerService: SpinnerService, 
    private modalService: ModalService, 
    private toastService: ToastService, 
    private navigate: NavigateToService,
    private paginationService: PaginationService){

  }
  save(key: any): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {

    this.modalService.setTitleModal("Eliminar producto");

    this.modalService.confirmEvent$.pipe(takeUntil(this.distroySuscriptions$)).subscribe(() => {
      this.remove();
    });

    this.paginationService.$currentPageEvent.pipe(takeUntil(this.distroySuscriptions$)).subscribe((value) => {
      this.getWarehouse(value.toString(), this.limit);
    });

  }

  ngOnDestroy() {

    this.paginationService.resetValues();
    this.distroySuscriptions$.next();
    this.distroySuscriptions$.complete();

  }

  edit(key: any): void {
    this.navigate.navigateTo('product/'+key);
  }

  delete(key: any): void {
    this.productId = key;
    this.modalService.setMessageModal("¿Desea eliminar el producto con key: "+this.productId+' ?.');
  }

  remove(): void {

    if (this.productId) {

      this.spinnerService.show();

      this.service.remove(this.productId).pipe(takeUntil(this.distroySuscriptions$)).subscribe(
        {
          next: res => {
            this.productId = undefined;
            this.showMessage('El producto se eliminó.');
            setTimeout(() => {
              this.navigate.reloadPage();
            },200);
            
          },
          error: err => {
            this.productId = undefined;
            this.showMessage(err.message);
          }
        }
      )

    }
  }

  getWarehouse(page:string, limit:string) {

    this.spinnerService.show();

    this.service.findAllPaginated(page, limit).pipe(takeUntil(this.distroySuscriptions$)).subscribe({
    
      next: res => {

        let products = res.data?.data.map((product: ProductModel) => {
          
          return {
            key: product.key,
            sku: product.provider_sku,
            name: product.name,
            existence: product.currentStock,
            existenceReturn: product.currentStockReturn
          };
        });

        this.data.rows = products;
        this.paginationService.setTotalPages(res.data?.totalPages);
        this.spinnerService.hide();
      },
      error: err => {
        this.showMessage(err.message);
      }
    });
  }

  showMessage(message:string) {
    this.toastService.setMessageToast(message);
    this.toastService.emitShowEvent();
    this.spinnerService.hide();
  }

  navigateTo(path:string) {
    this.navigate.navigateTo(path);
  }
  
}
