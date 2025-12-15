import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigateToService } from '../../../services/navigate-to.service';

@Component({
  selector: 'app-tabs-product',
  standalone: true,
  imports: [],
  templateUrl: './tabs-product.component.html',
  styleUrl: './tabs-product.component.css'
})
export class TabsProductComponent implements AfterViewInit{

  @ViewChild('tabProduct') tabProduct!: ElementRef;
  @ViewChild('tabPricesProduct') tabPricesProduct! : ElementRef;
  @ViewChild('tabLoadProduct') tabLoadProduct! : ElementRef;

  productId: number | undefined;
  
  constructor(private navigate: NavigateToService) {}
  
  ngAfterViewInit(): void {

  }

  destroy(): void {
   
  }

  ngOnInit() {
    
  }

  activateTab(tab:String) {

    this.deactivateTabs();

    switch(tab) {

      case "tabProduct":
        this.tabProduct.nativeElement.classList.add('activeTab');
        break;

      case "tabPricesProduct":
        this.tabPricesProduct.nativeElement.classList.add('activeTab');
        break;
      
      case "tabLoadProduct":
        this.tabLoadProduct.nativeElement.classList.add('activeTab');
        break;

      default:
        break;
    };

  }

  deactivateTabs() {
    this.tabProduct.nativeElement.classList.remove('active');
    this.tabPricesProduct.nativeElement.classList.remove('active');
    this.tabLoadProduct.nativeElement.classList.remove('active');
  }

  navigateTo(path:string){
    this.navigate.navigateTo(path+'/'+this.productId);
  }

  setProductId(productId: number | undefined) {
    this.productId = productId;
  }
}
