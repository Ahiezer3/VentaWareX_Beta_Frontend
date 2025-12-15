import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from '../../auth-service.service';
import { MenuService } from '../../services/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @ViewChild('saleProducts') saleProducts!: ElementRef;
  @ViewChild('sales') sales!: ElementRef;
  @ViewChild('warehouse') warehouse!: ElementRef;
  @ViewChild('prices') prices!: ElementRef;
  @ViewChild('customers') customers!: ElementRef;
  @ViewChild('dashboards') dashboards!: ElementRef;

  iconsMobile: any = [];

  constructor(
    private authservice:AuthService, 
    private menuService: MenuService, 
    private renderer: Renderer2,
    private router: Router) {

  }

  ngAfterViewInit() {

    this.iconsMobile.push({
      path: 'saleProducts',
      elementRef: this.saleProducts
    });

    this.iconsMobile.push({
      path: 'sales',
      elementRef: this.sales
    });

    this.iconsMobile.push({
      path: 'warehouse',
      elementRef: this.warehouse
    });

    this.iconsMobile.push({
      path: 'prices',
      elementRef: this.prices
    });

    this.iconsMobile.push({
      path: 'customers',
      elementRef: this.customers
    });
    
    this.iconsMobile.push({
      path: 'dashboards',
      elementRef: this.dashboards
    });

    this.navigateTo(this.router.url);
  }

  toggleMenu() {
    this.menuService.toggleMenu();
  }
  
  logout(){
    this.authservice.logout();
    this.menuService.setMenuOpenSubject(false);
    this.menuService.blockScreen(false);
  }

  navigateTo(path:string){

    path = path || "/dashboards";

    path = path.startsWith("/") ? path.slice(1) : path;
    
    this.iconsMobile.forEach((icon: any) => {
      this.removeClassMobileIconNavSelected(icon);
    });

    const iconSelected = this.iconsMobile.find((icon: { path: string; }) => {
      return icon.path == path;
    });

    iconSelected ? this.addClassMobileIconNavSelected(iconSelected) : null;

    this.menuService.navigateTo(path);
  }

  addClassMobileIconNavSelected(element:any) {
    const elementNew: ElementRef = element.elementRef;
    this.renderer.addClass(elementNew.nativeElement, 'mobileIconNavSelected');
  }

  removeClassMobileIconNavSelected(element:any) {
    const elementNew: ElementRef = element.elementRef;
    this.renderer.removeClass(elementNew.nativeElement, 'mobileIconNavSelected');
  }
}
