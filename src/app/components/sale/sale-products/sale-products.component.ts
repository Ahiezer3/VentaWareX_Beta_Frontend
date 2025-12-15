import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectConfig } from '@ng-select/ng-select';
import { MyHeaderComponent } from '../../my-header/my-header.component';
import { MyTableComponent } from '../../my-table/my-table.component';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SaleModel } from '../../../models/sale.model';
import { SaleService } from '../../../services/sale.service';
import { CustomerService } from '../../../services/customer.service';
import { PricesProductService } from '../../../services/prices-product.service';
import { SpinnerService } from '../../../services/spinner.service';
import { ModalService } from '../../../services/modal.service';
import { ToastService } from '../../../services/toast.service';
import { NavigateToService } from '../../../services/navigate-to.service';
import { ToolService } from '../../../services/tool.service';
import { SaleDetailModel } from '../../../models/saleDetail';

@Component({
  selector: 'app-saleProducts',
  standalone: true,
  imports: [MyHeaderComponent, CommonModule, FormsModule, NgSelectModule, NgSelectComponent],
  templateUrl: './sale-products.component.html',
  styleUrl: './sale-products.component.css',
  providers: [{ provide: 'MyTableInterface', useExisting: SaleProductsComponent }]
})
export class SaleProductsComponent {

  private distroySuscriptions$: Subject<void> = new Subject<void>();

  @ViewChild('customerInput') customerInput!: NgSelectComponent;
  
  @ViewChildren('priceInput') priceInputs!: QueryList<ElementRef>;
  
  @ViewChildren('priceMobileInput') priceMobileInputs!: QueryList<ElementRef>;
  

  @ViewChildren('quantityInput') quantityInputs!: QueryList<ElementRef>;

  @ViewChildren('quantityMobileInput') quantityMobileInputs!: QueryList<ElementRef>;


  @ViewChildren('quantityReturnInput') quantityReturnInputs!: QueryList<ElementRef>;

  @ViewChildren('quantityReturnMobileInput') quantityReturnMobileInputs!: QueryList<ElementRef>;

  @ViewChild('saleLeft') saleLeft! : ElementRef;
  @ViewChild('productsDiv') productsDiv! : ElementRef;
  @ViewChild('expandedView') expandedView!: ElementRef;
  @ViewChild('minimizedView') minimizedView!: ElementRef;
  @ViewChild('toggleBtn') toggleBtn!: ElementRef;
  
  titlePage ="Nueva venta";
  detailPage = "";

  printSale:boolean = false;
  customer:any = {};

  customerSelect:number | undefined;

  productRemove: number | undefined;

  customers:any[] = [];

  productsPrices:any[] = [];

  sale:SaleModel = {
    keyCustomer: undefined,
    customerName : undefined,
    listPrice: undefined,
    date: new Date(),
    totalProducts: 0,
    totalReturn: 0,
    quantityPackaging: 0,
    quantityRefund: 0,
    subtotal: 0,
    iva: 0,
    ieps: 0,
    total: 0,
    subtotalOriginal: 0,
    totalCost: 0,
    refundAmount: 0,
    packagingAmount: 0,

    subtotalFormat: '0',
    ivaFormat: '0',
    iepsFormat: '0',
    totalFormat: '0',
    subtotalOriginalFormat: '0',
    totalCostFormat: '0',
    refundAmountFormat: '0',
    packagingAmountFormat: '0',

    details: []
  };

  saleSaved:any | undefined;

  constructor(private service: SaleService, 
    private customerService: CustomerService, 
    private priceProductService: PricesProductService, 
    private spinnerService:SpinnerService, 
    private modalService: ModalService, 
    private toastService:ToastService, 
    private navigateService: NavigateToService,
    private tool: ToolService,
    private renderer: Renderer2) {}

  ngOnInit() {
    this.placeCustomers();
    this.getProductsPrices();

    this.modalService.confirmEvent$.pipe(takeUntil(this.distroySuscriptions$)).subscribe(() => {
      this.validateModal();
    });
  }

  ngOnDestroy() {

    this.distroySuscriptions$.next();
    this.distroySuscriptions$.complete();

  }

  validateModal() {

    if (this.printSale) {
      this.printSaleSaved();
    } else if (this.productRemove) {
      this.removeProduct();
    }
  }

  placeCustomers() {

    this.spinnerService.show();

    this.customerService.findAll().pipe(takeUntil(this.distroySuscriptions$)).subscribe({
      
      next: (res: any) => {
        
        this.customers = res.data;
        this.customers = this.customers.map( (customer) => {
          customer["customerSelect"] = customer.name + " - " + (customer.listPrice == "listOne" ? "Lista 1" : (customer.listPrice == "listTwo" ? "Lista 2" : (customer.listPrice == "listThree" ? "customer.listPrice" : "")));

          return customer;
        })
        .sort((a, b) => {
          const nameA = a.name?.toLowerCase() ?? '';
          const nameB = b.name?.toLowerCase() ?? '';
      
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });

        this.spinnerService.hide();

      },
      error: (err: { message: string; }) => {
        console.log(err);
        this.spinnerService.hide();
      }

    });

  }

  getProductsPrices() {

    this.priceProductService.findAll().pipe(takeUntil(this.distroySuscriptions$)).subscribe({
      
      next: (res: any) => {
        
        this.productsPrices = res.data.filter((price: { product: { key: any; }; }) => {
          return price.product?.key;
        });
       
      },
      error: (err: { message: string; }) => {
        console.log(err);
      }
      
    });

  }

  placeProductsPrices(list: string) {

    const updatedDetails = this.productsPrices.map((product) => {
      const price = this.findPrice(product.keyProduct, list);
      const priceReturn = this.findPriceReturn(product.keyProduct);
      const cost = this.findCost(product.keyProduct);
  
      const productSale: SaleDetailModel = {
        keyProduct: product.product.key,
        sku: product.product.sku,
        nameProduct: product.product.name,
        listSelected: list,
        price: Number(this.tool.formatNumber(price, false)),
        basePriceTaxes: Number(this.tool.formatNumber(cost, false)),
        priceReturn: Number(this.tool.formatNumber(priceReturn, false)),
        quantity: 0,
        quantityReturn: 0,
        quantityPackaging: 0,
        quantityRefund: 0,
        return: product.product.return,
        subtotal: 0,
        iva: 0,
        ieps: 0,
        total: 0,
        subtotalOriginal: 0,
        totalCost: 0,
        refundAmount: 0,
        packagingAmount: 0,

        iepsPercentage: Number(this.tool.formatNumber(product.ieps, false)),
        ivaPercentage: Number(this.tool.formatNumber(product.iva, false)),
        unityTotal: 0,
  
        priceFormat: this.tool.formatNumber(price, true),
        quantityFormat: this.tool.formatNumber(0, true),
        subtotalFormat: this.tool.formatNumber(0, true),
        ivaFormat: this.tool.formatNumber(0, true),
        iepsFormat: this.tool.formatNumber(0, true),
        totalFormat: this.tool.formatNumber(0, true),
        subtotalOriginalFormat: this.tool.formatNumber(0,false),
        totalCostFormat: this.tool.formatNumber(0, true),
        refundAmountFormat: this.tool.formatNumber(0, true).toString(),
        packagingAmountFormat: this.tool.formatNumber(0, true).toString()
      };
  
      return productSale;
    }).sort((a, b) => {
      const nameA = a.nameProduct?.toLowerCase() ?? '';
      const nameB = b.nameProduct?.toLowerCase() ?? '';
  
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  
    this.sale.details = [...updatedDetails];
  
  }

  onChangeCustomer(value:any) {
  
    this.spinnerService.show();

    this.resetSaleDetails();

    const customer = this.findCustomer(this.customerSelect);
    customer ? this.placeProductsPrices(customer.listPrice) : null;

    this.updateSaleCustomer(customer);

    this.updateSaleSummary();

    this.customerInput.blur(); 
    
    this.spinnerService.hide();

  }

  findCustomer(key:number | undefined) {

    return this.customers.find((customer) => {
      return key && customer.key == key;
    });
  }

  findProduct(key:number | undefined) {

    return this.productsPrices.find((productPrices) => {
      return key && productPrices.key == key;
    });
  }

  findProductSale(key:number) {

    return this.sale.details?.find((productSale) => {
      return productSale.keyProduct == key;
    });
  }

  calculatePriceProduct(product:any) {

    //Example: 100 + 8 + 17.28 = 125.28

    if (!this.customerSelect) {
      this.toastService.setMessageToast("Debes seleccionar un cliente.");
      this.toastService.emitShowEvent();
      return;
    }

    const quantity = product.quantity;
    let quantityPackaging = 0;
    let quantityRefund = 0;
    let refundAmount = 0;
    let packagingAmount = 0;
    let unityRefundAmount = 0;
    let unityPackagingAmount = 0;

    const priceTaxes:number = Number(product.price);
    const ivaPercentage:number = Number(product.ivaPercentage);
    const iepsPercentage:number = Number(product.iepsPercentage);
    let price: number = this.tool.calculateUnitySubtotal(priceTaxes, ivaPercentage, iepsPercentage);
    let priceOriginal: number = price;

    if (product.return && product.quantity != product.quantityReturn) {

      if (product.quantityReturn < product.quantity) {
        quantityPackaging = Number(product.quantity) - Number(product.quantityReturn);
        unityPackagingAmount = Number(!isNaN(product.priceReturn) ? this.tool.calculateUnitySubtotal(product.priceReturn, ivaPercentage, iepsPercentage) : 0);
        packagingAmount = unityPackagingAmount * quantityPackaging;
      } else {
        quantityRefund = Number(product.quantityReturn) - Number(product.quantity);
        unityRefundAmount = Number(!isNaN(product.priceReturn) ? this.tool.calculateUnitySubtotal(product.priceReturn, ivaPercentage, iepsPercentage) : 0);
        refundAmount = unityRefundAmount * quantityRefund;
      }
    }

    const subtotalOriginal = priceOriginal * quantity;
    const subtotal = subtotalOriginal + packagingAmount - refundAmount;
    const totalIeps = (subtotal * (iepsPercentage/100));
    const subtotalWithIeps = (subtotal + totalIeps);
    const totalIva = (subtotalWithIeps * (ivaPercentage/100));
    let total = (subtotal + totalIeps + totalIva);

    const unitySubtotal = price + unityPackagingAmount - unityRefundAmount;
    const unityTotalIeps = (unitySubtotal * (iepsPercentage/100));
    const unitySubtotalWithIeps = (unitySubtotal + unityTotalIeps);
    const unityTotalIva = (unitySubtotalWithIeps * (ivaPercentage/100));
    const unityTotal = (unitySubtotal + unityTotalIeps + unityTotalIva);

    const cost = Number(!isNaN(product.basePriceTaxes) ? product.basePriceTaxes : 0);
    const totalCost = quantity * cost;

    if (price <= 0) {
      this.toastService.setMessageToast('El precio no es válido para el producto: "' + product.nameProduct+ '".');
      this.toastService.emitShowEvent();
      return;
    }

    product.quantityPackaging = quantityPackaging;
    product.quantityRefund = quantityRefund;
    product.subtotalOriginal = subtotalOriginal;
    product.subtotal = subtotal;
    product.iva = totalIva;
    product.ieps = totalIeps;
  
    product.total = total;
    product.totalCost = totalCost;
    product.iepsPercentage = iepsPercentage;
    product.ivaPercentage = ivaPercentage;
    product.unityTotal =unityTotal;
    product.refundAmount = refundAmount;
    product.packagingAmount = packagingAmount;

    product.priceFormat = this.tool.formatNumber(price, true);
    product.quantityFormat = this.tool.formatNumber(quantity, true);
    product.subtotalOriginalFormat = this.tool.formatNumber(subtotalOriginal, true);
    product.subtotalFormat = this.tool.formatNumber(subtotal, true);
    product.ivaFormat = this.tool.formatNumber(totalIva, true);
    product.iepsFormat = this.tool.formatNumber(totalIeps, true);
    
    product.totalFormat = this.tool.formatNumber(total, true);
    product.totalCostFormat = this.tool.formatNumber(totalCost, true);
    product.refundAmountFormat = this.tool.formatNumber(refundAmount, true);
    product.packagingAmountFormat = this.tool.formatNumber(packagingAmount, true);

    this.updateSaleSummary();

  }

  delete(key:number) {
    this.productRemove = key;
    this.modalService.setTitleModal("Eliminar producto");
    this.modalService.setMessageModal("¿Desea eliminar el producto?.");
  }

  removeProduct() {

    if (!this.productRemove) {
      this.toastService.setMessageToast("Debes seleccionar un producto.");
      this.toastService.emitShowEvent();
      return;
    }

    this.spinnerService.show();

    const indexProduct = this.sale.details?.findIndex((productSales) => {
      return this.productRemove && productSales.keyProduct == this.productRemove;
    });

    indexProduct != -1 && this.sale.details ? this.sale.details.splice(indexProduct,1) : null;

    this.updateSaleSummary();

    this.productRemove = undefined;

    this.spinnerService.hide();

  }

  resetSelectCustomerField() {
    this.customerSelect = undefined;
  }

  findPrice(keyProduct:number, listSelected:string):number {

    let price = 0;

    const productPrice = this.productsPrices.find((product) => {
      return product.keyProduct == keyProduct;
    });


    if (productPrice) {

      if (listSelected == 'listFree') {
        price = productPrice['listOneTaxes'];
      } else {
        price = productPrice[listSelected+'Taxes'];
      }
     
    }

    return price;
  }

  findPriceReturn(keyProduct:number):number {

    let price = 0;

    const productPriceReturn = this.productsPrices.find((product) => {
      return product.keyProduct == keyProduct;
    });


    if (productPriceReturn) {
      price = productPriceReturn.priceReturn;
    }

    return price;
  }

  findCost(keyProduct:number):number {

    let cost = 0;

    const productCost = this.productsPrices.find((product) => {
      return product.keyProduct == keyProduct;
    });


    if (productCost) {
      cost = productCost.basePriceTaxes;
    }

    return cost;
  }

  updateProduct(product: any, index: number, input:string, typeView:string) {

    this.updateQuantityReturn(product);
    this.calculatePriceProduct(product);

    const indexProduct = this.sale.details.findIndex(p => p.keyProduct === product.keyProduct);

    if (indexProduct !== -1) {
      this.sale.details[indexProduct] = {...product};
    }

     // Mantener el foco en el input del producto que cambió
    if (typeView == 'desktop') {
      setTimeout(() => {
        if (input === 'price') {
          this.priceInputs.toArray()[index].nativeElement.focus();
        } else if (input === 'quantity') {
          this.quantityInputs.toArray()[index].nativeElement.focus();
        } else if (input === 'quantityReturn') {
          this.quantityReturnInputs.toArray()[index].nativeElement.focus();
        }
      }, 100);
    } else if (typeView == 'mobile') {
      setTimeout(() => {
        if (input === 'price') {
          this.priceMobileInputs.toArray()[index].nativeElement.focus();
        } else if (input === 'quantity') {
          this.quantityMobileInputs.toArray()[index].nativeElement.focus();
        } else if (input === 'quantityReturn') {
          this.quantityReturnMobileInputs.toArray()[index].nativeElement.focus();
        }
      }, 200);
    }

  }

  updateQuantityReturn(product: any) { 
    if (product.return) {
      product.quantityReturn = product.quantity;
    }
  }

  quantityIncrease(productSale: any) {
    productSale.quantity += 1;
    this.updateQuantityReturn(productSale);
    this.calculatePriceProduct(productSale);
  }

  quantityDecrease(productSale: any) {
    productSale.quantity -= 1;
    this.updateQuantityReturn(productSale);
    productSale.quantity = productSale.quantity < 0 ? 0 : productSale.quantity ;
    this.calculatePriceProduct(productSale);
  }

  quantityReturnIncrease(productSale: any) {
    productSale.quantityReturn += 1;
    this.calculatePriceProduct(productSale);
    // this.updateSaleSummary();
  }

  quantityReturnDecrease(productSale: any) {
    productSale.quantityReturn -= 1;
    productSale.quantityReturn = productSale.quantityReturn  < 0 ? 0 : productSale.quantityReturn;
    this.calculatePriceProduct(productSale);
    // this.updateSaleSummary();
  }

  updatePriceProduct(product:any, index:number) {
  
    const price: number = Number(this.tool.formatNumber(this.findPrice(product.keyProduct, product.listSelected),false));
    product.price = price;
  
    this.updateProduct(product, index, '', '');

  }

  updateSaleCustomer(customer:any) {

    this.sale.keyCustomer = this.customerSelect;
    this.sale.customerName = customer?.name;
    this.sale.customer = customer?? undefined;
    this.sale.listPrice = customer?.listPrice;

  }
  
  resetSaleCustomer() {
    this.sale.keyCustomer = undefined;
    this.sale.customerName = undefined;
    this.sale.listPrice = undefined;
    this.sale.date = new Date();
  }

  resetSaleDetails() {
    this.sale.details = [];
  }

  updateSaleSummary() {

    this.resetSaleSummary();

    this.sale.details?.forEach((product) => {
      this.sale.totalProducts += product.quantity;
      this.sale.totalReturn += product.quantityReturn;
      this.sale.quantityPackaging += product.quantityPackaging;
      this.sale.quantityRefund += product.quantityRefund;
      this.sale.subtotal += product.subtotal;
      this.sale.iva += product.iva;
      this.sale.ieps += product.ieps;
      this.sale.total += product.total;
      this.sale.subtotalOriginal += product.subtotalOriginal;
      this.sale.totalCost += product.totalCost;
      this.sale.refundAmount += product.refundAmount;
      this.sale.packagingAmount += product.packagingAmount;
    });

    this.sale.subtotalFormat = this.tool.formatNumber(this.sale.subtotal, false); 
    this.sale.ivaFormat = this.tool.formatNumber(this.sale.iva, false); 
    this.sale.iepsFormat = this.tool.formatNumber(this.sale.ieps, false);
    this.sale.totalFormat = this.tool.formatNumber(this.sale.total, false); 
    this.sale.subtotalOriginalFormat = this.tool.formatNumber(this.sale.subtotalOriginal, false); 
    this.sale.totalCostFormat = this.tool.formatNumber(this.sale.totalCost, false); 
    this.sale.refundAmountFormat = this.tool.formatNumber(this.sale.refundAmount, false); 
    this.sale.packagingAmountFormat = this.tool.formatNumber(this.sale.packagingAmount, false); 
  }

  resetSaleSummary() {
    this.sale.totalProducts = 0;
    this.sale.totalReturn = 0;
    this.sale.quantityPackaging = 0;
    this.sale.quantityRefund = 0;
    this.sale.subtotal = 0;
    this.sale.iva = 0;
    this.sale.ieps = 0;
    this.sale.total = 0;
    this.sale.subtotalOriginal = 0;
    this.sale.totalCost = 0;
    this.sale.refundAmount = 0;
    this.sale.packagingAmount = 0;

    this.sale.subtotalFormat = "0";
    this.sale.ivaFormat = "0";
    this.sale.iepsFormat = "0";
    this.sale.totalFormat = "0";
    this.sale.subtotalOriginalFormat = "0";
    this.sale.totalCostFormat = "0";
    this.sale.refundAmountFormat = "0";
    this.sale.packagingAmountFormat = "0";
  }

  pay() {

   
    if(!this.sale.keyCustomer || !this.sale.customer || !this.sale.customerName ) {
      this.toastService.setMessageToast("Debes seleccionar un cliente.");
      this.toastService.emitShowEvent();
      return;
    }

    if(!this.sale.details || this.sale.details.length == 0) {
      this.toastService.setMessageToast("La venta debe tener almenos un producto válido.");
      this.toastService.emitShowEvent();
      return;
    }

    // if(this.sale.subtotal <= 0 || this.sale.total <= 0) {
    //   this.toastService.setMessageToast("La venta es inválida.");
    //   this.toastService.emitShowEvent();
    //   return;
    // }

    this.sale.details = this.sale.details.filter(product => product.quantity > 0 || product.quantityPackaging > 0 || product.quantityRefund > 0);

    this.saveSale();
  }

  saveSale() {

    this.spinnerService.show();

    this.service.create(this.sale).pipe(takeUntil(this.distroySuscriptions$)).subscribe({
      
      next: (res: any) => {

        this.printSale = true;
        this.saleSaved = res.data;

        this.resetSale();

        this.spinnerService.hide();

        this.printSaleSaved();
  
      },
      error: (err: { message: string; }) => {

        this.toastService.setMessageToast(err.message);
        this.toastService.emitShowEvent();

        console.log(err);
        this.spinnerService.hide();
      }

    });

  }

  resetSale() {

    this.resetSaleCustomer();
    this.resetSaleDetails();
    this.resetSaleSummary();

    this.resetSelectCustomerField();

  }

  isOnlyRefund(product: SaleDetailModel):boolean {
    return product && product.return && product.quantity == 0 && product.quantityReturn > 0;
  }

  printSaleSaved() {
    this.navigateService.navigateTo("ticket/"+this.saleSaved.key);
  }

  edit(key: any): void {
    
  }

  trackByFn(index: number, item: any): any {
    return item.keyProduct; // Usa un identificador único
  }
  
  toggleMinimize() {

    // Verificamos si está expandido o minimizado
    if (this.expandedView.nativeElement.style.display === "" || this.expandedView.nativeElement.style.display === "none") {
        // Si está minimizado, lo expandimos
        this.expandedView.nativeElement.style.display = "block";
        this.minimizedView.nativeElement.style.display = "none";

        this.renderer.removeClass(this.toggleBtn.nativeElement, 'fa-square-plus');
        this.renderer.addClass(this.toggleBtn.nativeElement, 'fa-square-minus');
        
    } else {
        // Si está expandido, lo minimizamos
        this.expandedView.nativeElement.style.display = "none";
        this.minimizedView.nativeElement.style.display = "block";

        this.renderer.removeClass(this.toggleBtn.nativeElement, 'fa-square-minus');
        this.renderer.addClass(this.toggleBtn.nativeElement, 'fa-square-plus');
    }
}
   
}

// #productsDiv {
//   max-height: calc(100vh - 525px) !important;

// #saleLeft {
//     height: calc(100vh - 550px) !important;