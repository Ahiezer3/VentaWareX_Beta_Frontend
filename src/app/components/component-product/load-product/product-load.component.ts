import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { TabsProductComponent } from '../tabs-product/tabs-product.component';
import { MyHeaderComponent } from '../../my-header/my-header.component';
import { MyTableComponent } from '../../my-table/my-table.component';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerService } from '../../../services/spinner.service';
import { ModalService } from '../../../services/modal.service';
import { ToastService } from '../../../services/toast.service';
import { MyCRUD } from '../../../classes/MyCRUD';
import { ProductLoad } from '../../../models/productLoad';
import { ProductLoadService } from '../../../services/product-load.service';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { NavigateToService } from '../../../services/navigate-to.service';
import { Subject, takeUntil } from 'rxjs';
import { ToolService } from '../../../services/tool.service';
import { PaginationComponent } from '../../pagination/pagination/pagination.component';
import { PaginationService } from '../../../services/pagination.service';

@Component({
  selector: 'app-load-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TabsProductComponent, MyHeaderComponent, MyTableComponent, PaginationComponent],
  templateUrl: './product-load.component.html',
  styleUrl: './product-load.component.css',
  providers: [{ provide: 'MyTableInterface', useExisting: ProductLoadComponent }]
})
export class ProductLoadComponent extends MyCRUD<ProductLoad> implements AfterViewInit{

  private distroySuscriptions$: Subject<void> = new Subject<void>();
  
  @ViewChild("loadType") loadType!: ElementRef;
  @ViewChild(TabsProductComponent) tabs!: TabsProductComponent;
  loadProductForm: FormGroup = this.formBuilder.group({});
  productLoadService: ProductLoadService;

  titlePage = "Cargar";
  detailPage = "Modifica la existencia del producto en inventario, incremento o decremento.";
  currentDate: string = moment().format("YYYY-MM-DD");
  currentStockLabel = 0;
  currentStock = 0;
  currentStockReturn = 0;
  isReturn:boolean = false;
  limit = "30";

  stockHistoryLoad: any[] = [];

  dataLoads:any = {
    key:"sku",
    columnNames:["key","Fecha", "Carga a", "Tipo", "Existencia actual", "Carga", "Nueva existencia"],
    keys:[{key:"key",columnName:"Key"},
      {key:"date",columnName:"Fecha"},
      {key:"loadTo",columnName:"Carga a"},
      {key:"loadType",columnName:"Tipo"},
      {key:"currentStock",columnName:"Existencia actual"},
      {key:"quantityLoad",columnName:"Carga"},
      {key:"newQuantityLoad",columnName:"Nueva existencia"}],
    rows:[]
  };

  myNavigate: NavigateToService;
  
  constructor(productLoadService: ProductLoadService, 
    spinnerService: SpinnerService, 
    modalService: ModalService, 
    toastService: ToastService, 
    private formBuilder: FormBuilder, 
    activatedRoute: ActivatedRoute, 
    navigateTo: NavigateToService,
    private tool: ToolService,
    private paginationService: PaginationService) {

    super(productLoadService, spinnerService, modalService, toastService, activatedRoute, navigateTo);
    this.productLoadService = productLoadService;
    this.myNavigate = navigateTo;
  }

  
  ngAfterViewInit(): void {
    this.tabs.activateTab("tabLoadProduct");
    this.tabs.setProductId(this.getIdParameter());
  }
;

  ngOnInit() {

    this.loadProductForm = this.formBuilder.group({
      loadTo: ['product', Validators.required],
      loadType: ['', Validators.required],
      dateLoad: [{value: this.currentDate, disabled:true}],
      quantityLoad: ['', Validators.required],
      newQuantityLoad: [{value:'0', disabled:true}],
      commentsLoad: [''],
    });

    this.onInit();
    
    if (!this.idParameter) {
      this.myNavigate.navigateTo("/product");
    }
    
    this.setFormModel(this.loadProductForm);
    this.setConfirmationMessage('Carga', '¿Desea guardar la carga?.','Inventario actualizado.');

    this.setUrlRedirectCreate("/productLoad/" + this.getIdParameter());
    this.setUrlRedirectUpdate("/productLoad/" + this.getIdParameter());
    this.setUrlRedirectDelete("/products");

    this.paginationService.$currentPageEvent.pipe(takeUntil(this.distroySuscriptions$)).subscribe((value) => {
      this.getLoads(value.toString(), this.limit);
    });
    
  }

  onQuantityLoadChange(event: Event | undefined): void {
    
    const currentStock = this.currentStockLabel ?? 0;
    const quantityLoad = this.loadProductForm.get('quantityLoad')?.value ? this.loadProductForm.get('quantityLoad')?.value : 0;
    let newQuantityLoad = 0;

    if (this.loadType.nativeElement.value == "increase") {
      newQuantityLoad = currentStock + (!isNaN(quantityLoad) ? parseInt(quantityLoad, 10) : 0);
    } else if (this.loadType.nativeElement.value == "decrease") {
      newQuantityLoad = currentStock - (!isNaN(quantityLoad) ? parseInt(quantityLoad, 10) : 0);
    } 

    this.loadProductForm.get('newQuantityLoad')?.setValue(newQuantityLoad);

  }

  override ngOnDestroy() {

    super.ngOnDestroy();

    this.paginationService.resetValues();
    this.distroySuscriptions$.next();
    this.distroySuscriptions$.complete();
    this.loadProductForm?.reset();
  }

  override read(): void {

    if (!this.getIdParameter()) {
      return;
    }

    this.productLoadService.getProduct(this.getIdParameter() ?? 0).pipe(takeUntil(this.distroySuscriptions$)).subscribe({
        next: (res: any) => {
            this.isReturn = res.data.return;
            this.currentStock = res.data.currentStock;
            this.currentStockReturn = res.data.currentStockReturn;

            let loadTo = this.loadProductForm.get("loadTo")?.value;
            this.updateCurrentStockLabel(loadTo);
        },
        error: (err: { message: string; }) => {
            this.showMessage(err.message);
        }
    });

  }

  override save(): void {

    if (!this.validateForm()) {
        return;
    }
    
    let model: ProductLoad = this.getFormModel()?.value as ProductLoad;
    let data = this.getData();
    data = data[0];
    
    model.key = data.key;
    model.keyProduct = this.getIdParameter();

    this.getSpinnerService().show();

    this.getIdParameter() ? this.create(model) : null;
  }

  override create(model: ProductLoad): void {

    this.productLoadService.create(model).pipe(takeUntil(this.distroySuscriptions$)).subscribe({
        next: (res: any) => {
            this.loadProductForm.reset();
            this.loadProductForm.get('loadTo')?.setValue('product');
            this.showMessage('Inventario actualizado.' + ' Key: '+res.data.key);
            this.read();
            this.getLoads("1", this.limit);  
        },
        error: (err: { message: string; }) => {
            this.showMessage(err.message);
        }
    });
   
  }

  getLoads(page:string, limit:string) {

    if (!this.getIdParameter()) {
      return;
    }

    this.productLoadService.loads(this.getIdParameter(), page, limit).pipe(takeUntil(this.distroySuscriptions$)).subscribe({
        next: (res: any) => {
          this.paginationService.setTotalPages(res.data?.totalPages);
          this.placeLoads(res);
        },
        error: (err: { message: string; }) => {
            this.showMessage(err.message);
        }
    });

  }

  placeLoads(data: any) {

    const content = data.data.data;

    this.stockHistoryLoad = content.map((row:any) => {
      return   {
        key: row.key,
        sku: row.productKey,
        date : this.tool.formatDate(new Date(row.dateLoad)),
        loadTo: this.tool.loadToFormat(row.loadTo),
        loadType : row.loadType && row.loadType == "increase" ? "Entrada" : "Salida",
        currentStock : row.currentStock,
        quantityLoad : row.quantityLoad,
        newQuantityLoad : row.newStock
      };
    });
    
    this.dataLoads.rows = this.stockHistoryLoad;
  }

  edit(key: any): void {
    
  }

  onLoadToChange(event:Event) {

    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    this.updateCurrentStockLabel(selectedValue);

  }

  updateCurrentStockLabel(selectedValue:string) {

    if (selectedValue == "product") {
      this.currentStockLabel = this.currentStock;
    } else {
      this.currentStockLabel = this.currentStockReturn;
    }

    this.onQuantityLoadChange(undefined);
  }

}
