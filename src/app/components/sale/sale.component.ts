// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MyTableComponent } from '../my-table/my-table.component';
// import { MyHeaderComponent } from '../my-header/my-header.component';
// import { SaleService } from '../../services/sale.service';
// import { PricesProductService } from '../../services/prices-product.service';
// import { CustomerService } from '../../services/customer.service';
// import { FormsModule } from '@angular/forms';
// import { SpinnerService } from '../../services/spinner.service';
// import { ModalService } from '../../services/modal.service';
// import { ToastService } from '../../services/toast.service';
// import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectConfig } from '@ng-select/ng-select';
// import { SaleDetailModel } from '../../models/saleDetail';
// import { SaleModel } from '../../models/sale.model';
// import { NavigateToService } from '../../services/navigate-to.service';
// import { ToolService } from '../../services/tool.service';
// import { Subject, takeUntil } from 'rxjs';

// @Component({
//   selector: 'app-sale',
//   standalone: true,
//   imports: [MyHeaderComponent, MyTableComponent, CommonModule, FormsModule, NgSelectModule, NgSelectComponent,
//     NgOptionTemplateDirective,
//     NgLabelTemplateDirective],
//   templateUrl: './sale.component.html',
//   styleUrl: './sale.component.css',
//   providers: [{ provide: 'MyTableInterface', useExisting: SaleComponent }]
// })
// export class SaleComponent {

//   private distroySuscriptions$: Subject<void> = new Subject<void>();
  
//   @ViewChild("productQuantity") productQuantity!: ElementRef; 

//   titlePage ="Nueva venta";
//   detailPage = "";

//   printSale:boolean = false;
//   customer:any = {};
//   product:any = {};

//   customerSelect:number | undefined;
//   productSelect:number | undefined;
//   productRemove: number | undefined;

//   customers:any[] = [];

//   productsPrices:any[] = [];
//   products:any[] = [];

//   sale:SaleModel = {
//     keyCustomer: undefined,
//     customerName : undefined,
//     listPrice: undefined,
//     date: new Date(),
//     totalProducts: 0,
//     totalReturn: 0,
//     subtotal: 0,
//     iva: 0,
//     ieps: 0,
//     total: 0,

//     subtotalFormat: '0',
//     ivaFormat: '0',
//     iepsFormat: '0',
//     totalFormat: '0',

//     details: []
//   };

//   data:any = {
//     key:"keyProduct",
//     columnNames:["Key","Producto","Precio","Cantidad", "Subtotal", "IEPS", "IVA","Total"],
//     keys:[
//       {
//         key:"keyProduct",
//         columnName:"Key"
//       },
//       {
//         key:"nameProduct",
//         columnName:"Nombre"
//       },
//       {
//         key:"priceFormat",
//         columnName:"Precio"
//       },
//       {
//         key:"quantity",
//         columnName:"Cantidad"
//       },
//       {
//         key:"subtotalFormat",
//         columnName:"Subtotal"
//       },
//       {
//         key:"iepsFormat",
//         columnName:"IEPS"
//       },
//       {
//         key:"ivaFormat",
//         columnName:"IVA"
//       },
//       {
//         key:"totalFormat",
//         columnName:"Total"
//       }
//     ],
//     rows:[]
//   };

//   saleSaved:any | undefined;

//   constructor(private service: SaleService, 
//     private customerService: CustomerService, 
//     private priceProductService: PricesProductService, 
//     private spinnerService:SpinnerService, 
//     private modalService: ModalService, 
//     private toastService:ToastService, 
//     private navigateService: NavigateToService,
//     private tool: ToolService) {
//     this.data.buttons = [
//       {
//         type:"delete",
//         text:"Borrar"
//       }
//     ];
    
//   }

//   ngOnInit() {
//     this.placeCustomers();
//     this.getProductsPrices();

//     this.modalService.confirmEvent$.pipe(takeUntil(this.distroySuscriptions$)).subscribe(() => {
//       this.validateModal();
//     });
//   }

//   ngOnDestroy() {

//     this.distroySuscriptions$.next();
//     this.distroySuscriptions$.complete();

//   }

//   validateModal() {

//     if (this.printSale) {
//       this.printSaleSaved();
//     } else if (this.productRemove) {
//       this.removeProduct();
//     }
//   }

//   placeCustomers() {

//     this.spinnerService.show();

//     this.customerService.findAll().pipe(takeUntil(this.distroySuscriptions$)).subscribe({
      
//       next: (res: any) => {
        
//         this.customers = res.data;
//         this.customers = this.customers.map( (customer) => {
//           customer["customerSelect"] = customer.name + " - " + (customer.listPrice == "listOne" ? "Lista 1" : (customer.listPrice == "listTwo" ? "Lista 2" : (customer.listPrice == "listThree" ? "customer.listPrice" : "")));

//           return customer;
//         })
//         .sort((a, b) => {
//           const nameA = a.name?.toLowerCase() ?? '';
//           const nameB = b.name?.toLowerCase() ?? '';
      
//           if (nameA < nameB) return -1;
//           if (nameA > nameB) return 1;
//           return 0;
//         });

//         this.spinnerService.hide();

//       },
//       error: (err: { message: string; }) => {
//         console.log(err);
//         this.spinnerService.hide();
//       }

//     });

//   }

//   getProductsPrices() {

//     this.priceProductService.findAll().pipe(takeUntil(this.distroySuscriptions$)).subscribe({
      
//       next: (res: any) => {
        
//         this.productsPrices = res.data.filter((price: { product: { key: any; }; }) => {
//           return price.product?.key;
//         });
       
//       },
//       error: (err: { message: string; }) => {
//         console.log(err);
//       }
      
//     });

//   }

//   placeProductsPrices(list:string) {

//     this.products = this.productsPrices.map((product) => {
//       product["productSelect"] = (product.product?.name ?? "") /*+ " - " + this.tool.formatNumber(product[list],true)*/;
//       return product;
//     })
//     .sort((a, b) => {
//       const nameA = a.product?.name?.toLowerCase() ?? '';
//       const nameB = b.product?.name?.toLowerCase() ?? '';
  
//       if (nameA < nameB) return -1;
//       if (nameA > nameB) return 1;
//       return 0;
//     });
    

//   }

//   onChangeCustomer(value:any) {
  
//     this.spinnerService.show();

//     const customer = this.findCustomer(this.customerSelect);
//     customer ? this.placeProductsPrices(customer.listPrice) : null;

//     this.resetSelectFields();
//     this.updateSaleCustomer(customer);
//     this.resetSaleDetails();
//     this.updateSaleSummary();

//     this.spinnerService.hide();

//   }

//   findCustomer(key:number | undefined) {

//     return this.customers.find((customer) => {
//       return key && customer.key == key;
//     });
//   }

//   findProduct(key:number | undefined) {

//     return this.productsPrices.find((productPrices) => {
//       return key && productPrices.key == key;
//     });
//   }

//   findProductSale(key:number) {

//     return this.sale.details?.find((productSale) => {
//       return productSale.keyProduct == key;
//     });
//   }

//   addProduct() {

//     if (!this.customerSelect) {
//       this.toastService.setMessageToast("Debes seleccionar un cliente.");
//       this.toastService.emitShowEvent();
//       return;
//     }

//     if (!this.productSelect) {
//       this.toastService.setMessageToast("Debes seleccionar un producto.");
//       this.toastService.emitShowEvent();
//       return;
//     }

//     if (this.productQuantity?.nativeElement.value <= 0) {
//       this.toastService.setMessageToast("Debes seleccionar una cantidad válida.");
//       this.toastService.emitShowEvent();
//       return;
//     }

//     let customer = this.findCustomer(this.customerSelect);
//     let product = this.findProduct(this.productSelect);

//     this.spinnerService.show();
//     const productSalesExists = this.findProductSale(product.product.key);
//     const productQuantityCurrent = parseInt(this.productQuantity?.nativeElement.value);

//     const quantity = productSalesExists ? Number(productSalesExists.quantity + productQuantityCurrent) : Number(productQuantityCurrent);
//     const quantityReturn = productSalesExists ? Number(productSalesExists.quantityReturn + productQuantityCurrent) : Number(productQuantityCurrent);
//     const price:number = Number(product[customer.listPrice]);
//     const ivaPercentage:number = Number(product.iva);
//     const iepsPercentage:number = Number(product.ieps);

//     const subtotal = price * quantity;
//     const totalIeps = (subtotal * (iepsPercentage/100));
//     const subtotalWithIeps = subtotal + totalIeps;
//     const totalIva = subtotalWithIeps * (ivaPercentage/100);
//     const total = subtotal + totalIeps + totalIva;

//     const unitySubtotal = price;
//     const unityTotalIeps = (unitySubtotal * (iepsPercentage/100));
//     const unitySubtotalWithIeps = unitySubtotal + unityTotalIeps;
//     const unityTotalIva = unitySubtotalWithIeps * (ivaPercentage/100);
//     const unityTotal = unitySubtotal + unityTotalIeps + unityTotalIva;

//     if (quantity <= 0 || price <= 0 || subtotal <= 0 || total <= 0) {
//       this.toastService.setMessageToast("El producto no es válido.");
//       this.toastService.emitShowEvent();
//       return;
//     }

//     const productSale:SaleDetailModel = {
//       keyProduct: product.product.key,
//       sku: product.product.sku,
//       nameProduct: product.product.name,
//       listSelected: '',
//       price: price,
//       quantity: quantity,
//       quantityReturn: quantityReturn,
//       return: product.return,
//       subtotal: subtotal,
//       iva: totalIva,
//       ieps: totalIeps,
//       total: total,

//       iepsPercentage:iepsPercentage,
//       ivaPercentage:ivaPercentage,
//       unityTotal:unityTotal,
      
//       priceFormat: this.tool.formatNumber(price, true),
//       quantityFormat: this.tool.formatNumber(quantity, true),
//       subtotalFormat: this.tool.formatNumber(subtotal, true),
//       ivaFormat: this.tool.formatNumber(totalIva, true),
//       iepsFormat: this.tool.formatNumber(totalIeps, true),
//       totalFormat: this.tool.formatNumber(total, true)
//     };

    
//     let existProduct = this.sale.details?.findIndex((productSale) => {
//       return productSale.keyProduct == product.product.key;
//     });

//     if (existProduct !== -1 && this.sale.details) {
//       this.sale.details[existProduct] = productSale;
//     } else {
//       this.sale.details?.push(productSale);
//     }

//     this.updateSaleSummary();
//     this.resetSelectFields();
//     this.spinnerService.hide();

//   }

//   delete(key:number) {
//     this.productRemove = key;
//     this.modalService.setTitleModal("Eliminar producto");
//     this.modalService.setMessageModal("¿Desea eliminar el producto?.");
//   }

//   removeProduct() {

//     if (!this.productRemove) {
//       this.toastService.setMessageToast("Debes seleccionar un producto.");
//       this.toastService.emitShowEvent();
//       return;
//     }

//     this.spinnerService.show();

//     const indexProduct = this.sale.details?.findIndex((productSales) => {
//       return this.productRemove && productSales.keyProduct == this.productRemove;
//     });

//     indexProduct != -1 && this.sale.details ? this.sale.details.splice(indexProduct,1) : null;

//     this.updateSaleSummary();

//     this.productRemove = undefined;

//     this.spinnerService.hide();

//   }

//   updateDataRows() {
//     this.data.rows = this.sale.details;
//   }

//   resetSelectCustomerField() {
//     this.customerSelect = undefined;
//   }

//   resetSelectFields() {
//     this.productSelect = undefined;
//     this.productQuantity.nativeElement.value = 1;
//   }

//   updateSaleCustomer(customer:any) {

//     this.sale.keyCustomer = this.customerSelect;
//     this.sale.customerName = customer?.name;
//     this.sale.customer = customer?? undefined;
//     this.sale.listPrice = customer?.listPrice;

//   }
  
//   resetSaleCustomer() {
//     this.sale.keyCustomer = undefined;
//     this.sale.customerName = undefined;
//     this.sale.listPrice = undefined;
//     this.sale.date = new Date();
//   }

//   resetSaleDetails() {
//     this.sale.details = [];
//     this.updateDataRows();
//   }

//   updateSaleSummary() {

//     this.resetSaleSummary();

//     this.sale.details?.forEach((product) => {
//       this.sale.totalProducts += product.quantity,
//       this.sale.subtotal += product.subtotal,
//       this.sale.iva += product.iva,
//       this.sale.ieps += product.ieps,
//       this.sale.total += product.total
//     });

//     this.sale.subtotalFormat = this.tool.formatNumber(this.sale.subtotal, false); 
//     this.sale.ivaFormat = this.tool.formatNumber(this.sale.iva, false); 
//     this.sale.iepsFormat = this.tool.formatNumber(this.sale.ieps, false);
//     this.sale.totalFormat = this.tool.formatNumber(this.sale.total, false); 

//   }

//   resetSaleSummary() {
//     this.sale.totalProducts = 0;
//     this.sale.subtotal = 0;
//     this.sale.iva = 0;
//     this.sale.ieps = 0;
//     this.sale.total = 0;

//     this.sale.subtotalFormat = "0";
//     this.sale.ivaFormat = "0";
//     this.sale.iepsFormat = "0";
//     this.sale.totalFormat = "0";
//   }

//   pay() {

   
//     if(!this.sale.keyCustomer || !this.sale.customer || !this.sale.customerName ) {
//       this.toastService.setMessageToast("Debes seleccionar un cliente.");
//       this.toastService.emitShowEvent();
//       return;
//     }

//     if(this.sale.details?.length == 0) {
//       this.toastService.setMessageToast("La venta debe tener almenos un producto válido.");
//       this.toastService.emitShowEvent();
//       return;
//     }

//     if(this.sale.totalProducts <= 0 || this.sale.subtotal <= 0 || this.sale.total <= 0) {
//       this.toastService.setMessageToast("La venta es inválida.");
//       this.toastService.emitShowEvent();
//       return;
//     }

//     this.saveSale();
//   }

//   saveSale() {

//     this.spinnerService.show();

//     this.service.create(this.sale).pipe(takeUntil(this.distroySuscriptions$)).subscribe({
      
//       next: (res: any) => {

//         this.printSale = true;
//         this.saleSaved = res.data;

//         this.resetSale();

//         this.spinnerService.hide();

//         this.printSaleSaved();
  
//       },
//       error: (err: { message: string; }) => {

//         this.toastService.setMessageToast(err.message);
//         this.toastService.emitShowEvent();

//         console.log(err);
//         this.spinnerService.hide();
//       }

//     });

//   }

//   resetSale() {

//     this.resetSaleCustomer();
//     this.resetSaleDetails();
//     this.resetSaleSummary();

//     this.resetSelectCustomerField();
//     this.resetSelectFields();
//   }

//   printSaleSaved() {
//     // this.toastService.setMessageToast("La venta: '"+this.saleSaved.key+"' fue registrada. \n Ahora puedes imprimir el ticket.");
//     // this.toastService.emitShowEvent();

//     this.navigateService.navigateTo("ticket/"+this.saleSaved.key);
//   }

//   edit(key: any): void {
    
//   }
   
// }
