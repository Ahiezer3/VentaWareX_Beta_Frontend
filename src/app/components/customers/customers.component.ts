import { Component } from '@angular/core';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { MyTableComponent } from '../my-table/my-table.component';
import { NavigateToService } from '../../services/navigate-to.service';
import { SpinnerService } from '../../services/spinner.service';
import { CustomerService } from '../../services/customer.service';
import { CustomerModel } from '../../models/customerModel';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';
import { MyTableInterface } from '../../interfaces/MyTableInterface';
import { ToolService } from '../../services/tool.service';
import { Subject, takeUntil } from 'rxjs';
import { PaginationComponent } from '../pagination/pagination/pagination.component';
import { PaginationService } from '../../services/pagination.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [MyHeaderComponent, MyTableComponent, PaginationComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
  providers: [{ provide: 'MyTableInterface', useExisting: CustomersComponent }]
})
export class CustomersComponent  implements MyTableInterface{

  private distroySuscriptions$: Subject<void> = new Subject<void>();
  
  limit = "30";
  titlePage ="Clientes";
  detailPage ="Lista de clientes";

  customerId: number | undefined;

  addNewItemText = this.menuService.mobileScreen() ? "+" : "Agregar";
  
  data:any = {
    key:"key",
    columnNames:["Nombre","Key","Dirección","Lista de precio"],
    keys:[
      {
        key: "name",
        columnName: "Nombre"
      },
      {
        key: "key",
        columnName: "Key"
      },
      {
        key: "address",
        columnName: "Dirección"
      },
      {
        key: "priceList",
        columnName: "Lista de precio"
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
    rows:[]
  };
  
  constructor(private service: CustomerService, 
    private menuService: MenuService,
    private spinnerService: SpinnerService, 
    private modalService: ModalService, 
    private toastService: ToastService, 
    private navigate: NavigateToService, 
    private tool:ToolService,
    private paginationService: PaginationService) {
  }
  
  save(key: any): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(){
    // this.getCustomers();

    this.modalService.setTitleModal("Eliminar cliente");

    this.modalService.confirmEvent$.pipe(takeUntil(this.distroySuscriptions$)).subscribe(() => {
      this.remove();
    });

    this.paginationService.$currentPageEvent.pipe(takeUntil(this.distroySuscriptions$)).subscribe((value) => {
      this.getCustomers(value.toString(), this.limit);
    });
  }

  ngOnDestroy() {
    this.paginationService.resetValues();
    this.distroySuscriptions$.next();
    this.distroySuscriptions$.complete();
  }

  edit(key: any): void {
    this.navigate.navigateTo('customer/'+key);
  }

  delete(key: any): void {
    this.customerId = key;
    this.modalService.setMessageModal("¿Desea eliminar el cliente con key: "+this.customerId+' ?.');
  }

  remove(): void {

    if (this.customerId) {

      this.spinnerService.show();

      this.service.remove(this.customerId).pipe(takeUntil(this.distroySuscriptions$)).subscribe(
        {
          next: res => {
            this.customerId = undefined;
            this.showMessage('El cliente se eliminó.');
            setTimeout(() => {
              this.navigate.reloadPage();
            },200);
            
          },
          error: err => {
            this.customerId = undefined;
            this.showMessage(err.message);
          }
        }
      )

    }
  }

  getCustomers(page:string, limit:string) {

    this.spinnerService.show();

    this.service.findAllPaginated(page, limit).pipe(takeUntil(this.distroySuscriptions$)).subscribe({
    
      next: res => {

        let customers = res.data?.data.map((customer: CustomerModel) => {
          
          return {
            key:customer.key,
            name:customer.name,
            address:customer.address,
            priceList:this.tool.getDescriptionList(customer?.listPrice)
          };

        });

        this.data.rows = customers;
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

  navigateTo(path:string){
    this.navigate.navigateTo(path);
  }

}
