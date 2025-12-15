import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, HostListener, Injector } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuService } from '../services/menu.service';
import { SpinnerService } from '../services/spinner.service';
import { ModalComponent } from './modal/modal.component';
import { ToastComponent } from './toast/toast.component';
import { Subject, takeUntil } from 'rxjs';
import { ToolService } from '../services/tool.service';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, HeaderComponent, MenuComponent, CommonModule, ModalComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements AfterViewInit{

  private distroySuscriptions$: Subject<void> = new Subject<void>();
  
  @ViewChild('page', { static:false}) page!: ElementRef;
  @ViewChild('content', { static:false}) content!: ElementRef;

  pageWidth!: number;
  menuOpen = false;
  showHeaderAndMenu: boolean = false;
  spinnerVisible = false;
  fullPages: string[] = ["",'/','login', 'errorPage', 'index'];


  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef, 
    private menuService: MenuService, 
    private spinnerService: SpinnerService,
    private toolService: ToolService,
    private authService: AuthService,
) {
      this.initializeApp();
  }

  initializeApp() {

  }
  
  ngAfterViewInit(): void {

    if (this.page) {
      this.menuService.setPageElement(this.page);
    } else {
      console.error('pageElement is not available in AfterViewInit.');
    }

    if (this.content) {
      this.menuService.setContentElement(this.content);
      this.getPageWidth();
    } else {
      console.error('contentElement is not available in AfterViewInit.');
    }
  }

  ngOnInit() {
    
    this.router.events.pipe(takeUntil(this.distroySuscriptions$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {

        const eventUrl = event.url;
        const urlAfterRedirects = event?.urlAfterRedirects;
        const urlClear = this.toolService.getClearUrl(eventUrl);
        const urlClearAfterRedirects = this.toolService.getClearUrl(urlAfterRedirects);
        const authenticated = this.authService.isLoged();

        this.showHeaderAndMenu = authenticated && this.fullPages.indexOf(urlClearAfterRedirects) == -1;

        this.cdr.detectChanges();
      }
    });

    this.menuService.menuOpen$.pipe(takeUntil(this.distroySuscriptions$)).subscribe(open => {
      this.menuOpen = open;
    });

    this.spinnerService.spinnerState.pipe(takeUntil(this.distroySuscriptions$)).subscribe(visible => {
      this.spinnerVisible = visible;
    });

  }

  ngOnDestroy() {
    this.distroySuscriptions$.next();
    this.distroySuscriptions$.complete();
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.getPageWidth();
  }

  getPageWidth() {

    if (typeof window !== 'undefined') {
      this.pageWidth = window.innerWidth;
    } else {
      this.pageWidth = 1000;
    }
    this.menuService.setPageWidth( this.pageWidth);
    this.menuService.blockScreenFromMenu();
  }

}
