import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigateToService {

  constructor(private router: Router) { }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  reloadPage() {
    window.location.reload();
  }

  getCurrentUrl(){
    return this.router.url;
  }
}
