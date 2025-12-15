import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../auth-service.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements AfterViewInit{
  
  private distroySuscriptions$: Subject<void> = new Subject<void>();
  
  menuOpen = true;

  // homeItem
  @ViewChild("homeItem") homeItem!: ElementRef

  // saleProductsItem
  @ViewChild("saleProductsItem") saleProductsItem!: ElementRef;

  // productItem
  @ViewChild("productItem") productItem!: ElementRef;

  // wharehouseItem
  @ViewChild("warehouseItem") warehouseItem!: ElementRef;

  // salesItem
  @ViewChild("salesItem") salesItem!: ElementRef;

  // pricesItem
  @ViewChild("pricesItem") pricesItem!: ElementRef;

  // customersItem
  @ViewChild("customersItem") customersItem!: ElementRef;

  // customerItem
  @ViewChild("customerItem") customerItem!: ElementRef;

  // dashboardsItem
  @ViewChild("dashboardsItem") dashboardsItem!: ElementRef;

  // otherItemItem
  @ViewChild("otherItem") otherItem!: ElementRef;

  // profileItem
  @ViewChild("profileItem") profileItem!: ElementRef;


  // Menu items
  menuItems : any[] = [];

  constructor(private menuService: MenuService, private authService: AuthService, private router: Router){

  }
 
  ngOnInit() {

    this.menuService.menuOpen$.pipe(takeUntil(this.distroySuscriptions$)).subscribe(open => {
      this.menuOpen = open;
    });

  }

  ngAfterViewInit(): void {

    this.menuItems.push({id: "home", item: this.homeItem});
    this.menuItems.push({id: "saleProducts", item: this.saleProductsItem});
    this.menuItems.push({id: "product", item: this.productItem});
    this.menuItems.push({id: "warehouse", item: this.warehouseItem});
    this.menuItems.push({id: "sales", item: this.salesItem});
    this.menuItems.push({id: "prices", item: this.pricesItem});
    this.menuItems.push({id: "customers", item: this.customersItem});
    this.menuItems.push({id: "customer", item: this.customerItem});
    this.menuItems.push({id: "dashboards", item: this.dashboardsItem});
    this.menuItems.push({id: "other", item: this.otherItem});
    this.menuItems.push({id: "profile", item: this.profileItem});

    this.selectItem(this.router.url);

    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe(event => {
      const nav = event as NavigationEnd;
      this.selectItem(nav.urlAfterRedirects);
    });

  }

  ngOnDestroy() {
    this.distroySuscriptions$.next();
    this.distroySuscriptions$.complete();
  }


  navigateTo(path:string){
    this.menuService.navigateTo(path);
  }

  logout(){
    this.authService.logout();
    this.menuService.setMenuOpenSubject(false);
    this.menuService.blockScreen(false);
  }

  selectItem(path:string) {

    path = path || "/home";

    path = path.slice(1);

    const elementSelected: any = this.menuItems.find(item=>{
      return item.id == path;
    });

    const item: ElementRef = elementSelected.item;

    this.menuItems.forEach(item=>{
      item.item.nativeElement.classList.remove("itemSelected");
    });

    item.nativeElement.classList.add("itemSelected");

  }

}
