import { Component } from '@angular/core';
import { MyHeaderComponent } from '../../my-header/my-header.component';
import { TabsProductComponent } from '../tabs-product/tabs-product.component';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { SpinnerService } from '../../../services/spinner.service';
import { ModalService } from '../../../services/modal.service';
import { ToastService } from '../../../services/toast.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavigateToService } from '../../../services/navigate-to.service';
import { Subject, takeUntil } from 'rxjs';
import { ToolService } from '../../../services/tool.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, MyHeaderComponent, TabsProductComponent, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  private distroySuscriptions$: Subject<void> = new Subject<void>();
  
  @ViewChild(TabsProductComponent) tabs!: TabsProductComponent;

  titlePage ="Datos del producto";
  detailPage = "Registre los datos del producto, cree o edite la información requerida";
  productId: number | undefined;
  productFound = false;
  sku = "";
  urlImage = "https://ventawarex.s3.us-west-2.amazonaws.com/agregar-producto.png";
  removeProductPressed = false;
  formProduct: FormGroup = this.formBuilder.group({});

  constructor(private productService: ProductService, 
    private spinnerService: SpinnerService, 
    private modalService: ModalService, 
    private toastService: ToastService, 
    private formBuilder: FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private navigateTo: NavigateToService,
    private toolService: ToolService) {

  }

  ngAfterViewInit(): void {

    this.tabs.activateTab("tabProduct");
    this.tabs.setProductId(this.productId);
  }

  ngOnInit(): void {

    this.spinnerService.hide();

    this.activatedRoute.paramMap.pipe(takeUntil(this.distroySuscriptions$)).subscribe(params => {
      const id = params.get('id');
      this.productId = id ? parseInt(id) : undefined;
    });

    this.modalService.confirmEvent$.pipe(takeUntil(this.distroySuscriptions$)).subscribe(() => {
      this.removeProductPressed ? this.removeProduct() : this.saveProduct();
    });

    this.formProduct = this.formBuilder.group({
      name: ['', Validators.required],
      provider: ['', Validators.required],
      category: ['', Validators.required],
      quantity: ['', Validators.required],
      description: ['', Validators.required],
      provider_sku: ['', Validators.required],
      measure: ['', Validators.required],
      image: [''],
      keyWarehouse: [''],
      return: ['false']
    });
    
    this.getProduct();

  };

  ngOnDestroy() {
    this.distroySuscriptions$.next();
    this.distroySuscriptions$.complete();
    this.formProduct?.reset();
  }

  getProduct() {

    if (this.productId) {

      this.spinnerService.show();

      this.productService.find(this.productId).pipe(takeUntil(this.distroySuscriptions$)).subscribe(
        {
          next: res => {
            this.productFound = true;
            this.placeProduct(res.data);
            this.spinnerService.hide();
          },
          error: err => {
            this.productFound = false;
            this.showMessage(err.message);
          }
        }
      )

    } 

  }

  placeProduct(product: ProductModel) {

    this.sku = product.provider_sku?? "";

    this.formProduct.setValue({
      name: product.name, 
      provider: product.provider,
      category: product.category,
      quantity: product.quantity?? 0,
      description: product.description,
      provider_sku: product.provider_sku,
      measure: product.measure,
      image: product.image,
      keyWarehouse: product.keyWarehouse?? 0,
      return: product.return
    });
    
  }

  save() {
    this.removeProductPressed = false;
    this.modalService.setTitleModal("Guardar producto");
    this.modalService.setMessageModal("¿Desea guardar el producto?.");
  }

  remove() {
    this.removeProductPressed = true;
    this.modalService.setTitleModal("Eliminar producto");
    this.modalService.setMessageModal('¿Dese eliminar el producto?.');
  }

  validateForm(): boolean {

    this.formProduct.markAllAsTouched();

    if (!this.formProduct.valid) {
      console.log("La información no es válida.");
      return false;
    }

    return true;
  }

  saveProduct() {

    if (!this.validateForm()) {
      return;
    }
    
    let product: ProductModel = this.formProduct.value as ProductModel;
    product.key = this.productId!;
    product.keyWarehouse = 0;
    product.currentStock = 0;

    product.return = this.toolService.stringToBoolean(this.formProduct.value.return);

    this.toastService.setTitleToast("Producto");

    this.spinnerService.show();

    this.productId ? this.update(this.productId, product) : this.create(product);

  }

  removeProduct() {

    if (this.productId) {

      this.spinnerService.show();

      this.productService.remove(this.productId).pipe(takeUntil(this.distroySuscriptions$)).subscribe(
        {
          next: res => {
            this.productId = undefined;
            this.showMessage('El producto se eliminó.');
            this.navigateTo.navigateTo('warehouse');
            
          },
          error: err => {
            this.productId = undefined;
            this.showMessage(err.message);
          }
        }
      )

    }

  }

  update(productId:number, product:ProductModel) {
    
    this.productService.update(productId,product).pipe(takeUntil(this.distroySuscriptions$)).subscribe({
      next: res => {
        this.showMessage('Producto actualizado.');
      },
      error: err => {
        this.showMessage(err.message);
      }
    });

  }

  create(product: ProductModel) {

    this.productService.create(product).pipe(takeUntil(this.distroySuscriptions$)).subscribe({
      next: res => {
        this.showMessage('Producto guardado.');
        this.navigateTo.navigateTo('/product/'+res.data.key);
   
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

};


