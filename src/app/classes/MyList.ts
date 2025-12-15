
import { SpinnerService } from '../services/spinner.service';
import { ModalService } from '../services/modal.service';
import { ToastService } from '../services/toast.service';
import { NavigateToService } from '../services/navigate-to.service';
import { MyService } from '../services/myService.service';
import { Subject, takeUntil } from 'rxjs';
import { Injectable } from '@angular/core';
import { PaginationService } from '../services/pagination.service';
import { MenuService } from '../services/menu.service';

@Injectable({
  providedIn: 'root',
})

export class MyList<T> {

  private distroySuscriptions$: Subject<void> = new Subject<void>();
  
  limit: string = "20";
  idParameter: number | undefined;
  urlRedirect: string | undefined;

  confirmationMessageSucces: string | undefined;

  addNewItemText = this.myMenuService.mobileScreen() ? "+" : "Agregar";

  next: any;

  data:any = {
    key:"key",
    columnNames:[],
    keys:[],
    buttons : [],
    rows:[]
  };

  constructor(private service: MyService<T>, 
    private spinnerService: SpinnerService, 
    private modalService: ModalService, 
    private toastService: ToastService, 
    private navigate: NavigateToService,
    private paginationService: PaginationService,
    private myMenuService: MenuService) {
  
  }
  
  save(key: any): void {
    throw new Error('Method not implemented.');
  }

  onInit(){

    this.modalService.confirmEvent$.pipe(takeUntil(this.distroySuscriptions$)).subscribe(() => {
      this.remove();
    });

    this.paginationService.$currentPageEvent.pipe(takeUntil(this.distroySuscriptions$)).subscribe((value) => {
      this.getRows(value.toString(), this.limit);
    });
  }

  ngOnDestroy() {

    this.paginationService.resetValues();
    this.distroySuscriptions$.next();
    this.distroySuscriptions$.complete();

  }

  edit(key: any): void {
    this.navigate.navigateTo(this.urlRedirect+key);
  }

  delete(key: any): void {
    this.idParameter = key;
  }

  remove(): void {

    if (this.idParameter) {

      this.spinnerService.show();

      this.service.remove(this.idParameter).pipe(takeUntil(this.distroySuscriptions$)).subscribe(
        {
          next: (res: any) => {
            this.idParameter = undefined;
            this.showMessage('El registro se eliminó.');
            this.navigate.reloadPage();
            
          },
          error: (err: { message: string; }) => {
            this.idParameter = undefined;
            this.showMessage(err.message);
          }
        }
      )

    }
  }

  getRows(page:string, limit:string) {

    this.spinnerService.show();

    this.service.findAllPaginated(page, limit).pipe(takeUntil(this.distroySuscriptions$)).subscribe({
    
      next: (res: { data: {data:T[], total:number, totalPages: number}; }) => {

        const rows = this.next(res.data);  
        this.setDataRows(rows);
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

  setConfirmationMessage(title:string, confirmationMessage:string, messageSuccess:string) {
    this.modalService.setTitleModal(title);
    this.modalService.setMessageModal(confirmationMessage+" "+this.idParameter);

    this.toastService.setTitleToast(title);
    this.confirmationMessageSucces = messageSuccess;
  }

  setUrlRedirect(url: string | undefined) {
    this.urlRedirect = url;
  }
  
  setDataKey(key:string){
    this.data.key = key;
  }

  setDataColumnNames(columnNames:any[]){
    this.data.columnNames = columnNames;
  }

  setDataKeys(keys:any[]){
    this.data.keys = keys;
  }

  addDataEditButton(){
    this.data.buttons.push({
        type:"edit",
        text:"Editar"
      });
  }

  addDataDeleteButton(){
    this.data.buttons.push({
        type:"delete",
        text:"Borrar"
      });
  }

  setDataRows(rows:T[]){
    this.data.rows = rows;
  }

  setNext(next: (res: { data: T[]; }) => T[]) {
    this.next = next;
  }
  
}
