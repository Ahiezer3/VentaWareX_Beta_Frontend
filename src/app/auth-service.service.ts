import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { SpinnerService } from './services/spinner.service';
import { ToastService } from './services/toast.service';
import { NavigateToService } from './services/navigate-to.service';
import { AuthModel } from './models/authModel';
import { MyService } from './services/myService.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService extends MyService<AuthModel> {

  private distroySuscriptions$: Subject<void> = new Subject<void>();
  
  constructor(http: HttpClient, 
    private spinnerService:SpinnerService,  
    private toastService:ToastService, 
    private navigateService: NavigateToService) {

      super(http);
      this.setEndpoint('auth/');
  }

  login(email: string, password: string) {

    let authModel: AuthModel = {
      email: email,
      password: password
    };

    this.spinnerService.show();

    this.create(authModel).pipe(takeUntil(this.distroySuscriptions$)).subscribe({
      
      next: (res: any) => {

        localStorage.setItem('token', res.data.access_token);
        this.spinnerService.hide();

        if (!this.isTokenValid(res.data.access_token)) {
          this.toastService.setMessageToast("No fue posible iniciar sesión.");
          this.toastService.emitShowEvent();
        }

        this.navigateService.navigateTo('/home'); 
  
      },
      error: (err: { message: string; }) => {

        this.toastService.setMessageToast(err.message);
        this.toastService.emitShowEvent();

        console.log(err);
        this.spinnerService.hide();
      }

    });

  }

  logout() {
    this.spinnerService.show();
    localStorage.removeItem('token'); 
    this.spinnerService.hide();

    this.navigateService.navigateTo('/login');
  }

  isAuthenticated(): Observable<boolean> {
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token');
        
        return of(token ? this.isTokenValid(token) : false);
    }
    return of(false);
  }

  isLoged(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token');
        return token ? this.isTokenValid(token) : false;
    }
    return false;
  }

  isTokenValid(token: string): boolean {

    const decoded: any = this.decodeToken(token);

    if (decoded && decoded.exp) {
      const expiry = decoded.exp * 1000; 
      return expiry > Date.now();
    }

    localStorage.removeItem('token');

    return false;

  }

  decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT token is invalid');
      }
      const decoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
}
