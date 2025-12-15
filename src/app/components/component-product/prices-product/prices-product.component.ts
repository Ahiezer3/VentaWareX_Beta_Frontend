import { Component, ViewChild } from '@angular/core';
import { TabsProductComponent } from '../tabs-product/tabs-product.component';
import { MyHeaderComponent } from '../../my-header/my-header.component';
import { ActivatedRoute } from '@angular/router';
import { PricesProductService } from '../../../services/prices-product.service';
import { SpinnerService } from '../../../services/spinner.service';
import { ModalService } from '../../../services/modal.service';
import { ToastService } from '../../../services/toast.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductPricesModel } from '../../../models/productPrices.model';
import { MyCRUD } from '../../../classes/MyCRUD';
import { CommonModule } from '@angular/common';
import { NavigateToService } from '../../../services/navigate-to.service';
import { Subject, takeUntil } from 'rxjs';
import { ToolService } from '../../../services/tool.service';
import { ProductModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-prices-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TabsProductComponent, MyHeaderComponent],
  templateUrl: './prices-product.component.html',
  styleUrl: './prices-product.component.css'
})
export class PricesProductComponent extends MyCRUD<ProductPricesModel>{

  private distroySubscriptions$: Subject<void> = new Subject<void>();
  
  @ViewChild(TabsProductComponent) tabs!: TabsProductComponent;

  titlePage = "Precios";
  detailPage = "Precios del producto";
  sku = "1";
  idPricesProduct: number | undefined;

  pricesProductForm: FormGroup = this.formBuilder.group({});
  productPrices: any;

  product: ProductModel | undefined;

  myNavigate: NavigateToService;

  constructor(productPrices: PricesProductService, 
    spinnerService: SpinnerService, 
    modalService: ModalService, 
    toastService: ToastService, 
    private formBuilder: FormBuilder, 
    activatedRoute: ActivatedRoute, 
    navigateTo: NavigateToService,
    private toolService: ToolService,
    private productService: ProductService
  ) {
    super(productPrices, spinnerService, modalService, toastService, activatedRoute,navigateTo);
    this.productPrices = productPrices;
    this.myNavigate = navigateTo;
  }

  ngOnInit(): void {

    this.pricesProductForm = this.formBuilder.group({
      basePriceTaxes: ['', Validators.required],
      listOneTaxes: ['', Validators.required],
      listTwoTaxes: ['', Validators.required],
      listThreeTaxes: ['', Validators.required],
      ieps: ['', Validators.required],
      iva: ['', Validators.required],
      priceReturn: ['']
    });

    this.onInit();

    if (!this.idParameter) {
      this.myNavigate.navigateTo("/product");
    }

    this.placeProduct();
    this.setFormModel(this.pricesProductForm);
    this.setConfirmationMessage('Precios', '¿Desea guardar los precios?.','Precios guardados.');

    this.setUrlRedirectCreate("/pricesProduct/" + this.getIdParameter());
    this.setUrlRedirectUpdate("/pricesProduct/" + this.getIdParameter());
    this.setUrlRedirectDelete("/products");

  };

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.distroySubscriptions$.next();
    this.distroySubscriptions$.complete();
    this.pricesProductForm?.reset();
}

  ngAfterViewInit(): void {

    this.tabs.activateTab("tabPricesProduct");
    this.tabs.setProductId(this.getIdParameter());

  }

  placeProduct() {

    let idParameter = this.getIdParameter();
    idParameter = idParameter ? idParameter : -1;

    this.productService.find(idParameter).pipe(takeUntil(this.distroySubscriptions$)).subscribe(
        {
            next: (res: { data: any; }) => {
              this.product = res.data;
            },
            error: (err: { message: string; }) => {
              this.showMessage(err.message);
            }
        }
    )
  }

  override place(data: any): void {

    if (!(data && data.length > 0)) {
      return;
    }

    data = data[0];

    this.product = data.product;

    this.getFormModel()?.setValue({
      basePriceTaxes: this.toolService.formatNumber(data.basePriceTaxes,false),
      listOneTaxes: this.toolService.formatNumber(data.listOneTaxes,false),
      listTwoTaxes: this.toolService.formatNumber(data.listTwoTaxes,false),
      listThreeTaxes: this.toolService.formatNumber(data.listThreeTaxes,false),
      ieps: this.toolService.formatNumber(data.ieps,false),
      iva: this.toolService.formatNumber(data.iva,false),
      priceReturn: this.toolService.formatNumber(data.priceReturn,false)
    });

  }

  override save(): void {

    if (!this.validateForm()) {
        return;
    }
    
    let model: ProductPricesModel = this.getFormModel()?.value as ProductPricesModel;
    let data = this.getData();
    data = data[0];
    
    model.key = data.key;
    model.keyProduct = this.getIdParameter();

    model.basePrice = this.toolService.calculateUnitySubtotal(model.basePriceTaxes,model.iva , model.ieps);
    model.listOne = this.toolService.calculateUnitySubtotal(model.listOneTaxes,model.iva , model.ieps);
    model.listTwo = this.toolService.calculateUnitySubtotal(model.listTwoTaxes,model.iva , model.ieps);
    model.listThree = this.toolService.calculateUnitySubtotal(model.listThreeTaxes,model.iva , model.ieps);

    this.getSpinnerService().show();

    this.getIdParameter() ? this.create(model) : null;
    
  }

  override create(model: ProductPricesModel) {

    this.productPrices.create(model).pipe(takeUntil(this.distroySubscriptions$)).subscribe({
        next: (res: any) => {
            this.showMessage("Precios guardados." + ' Key: '+res.data.key);
            this.pricesProductForm?.reset();
            this.reloadPage();
        },
        error: (err: { message: string; }) => {
            this.showMessage(err.message);
        }
    });

}
 
}
