import { Component } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { AuthService } from '../auth-service.service';
import { map, Subject, takeUntil } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  
  private unsubscribe$ = new Subject<void>();
  
  loginText = "Iniciar sesión";

  constructor(private menuService: MenuService, private authService: AuthService, private spinnerService: SpinnerService) {

  }

  ngOnInit() {

    this.spinnerService.hide();
    
    this.authService.isAuthenticated().pipe(
      map((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this.loginText = "Inicio";
        } else {
          this.loginText = "Iniciar sesión";
        }
      }),
      takeUntil(this.unsubscribe$) // Esto se asegura de que la suscripción se cancele cuando el componente se destruya
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  navigateTo(path:string){
    this.menuService.navigateTo(path);
  }
}
