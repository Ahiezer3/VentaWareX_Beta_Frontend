import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth-service.service";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(

    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

      return this.authService.isAuthenticated().pipe(
        map((isAuthenticated: boolean) => {
          if (!isAuthenticated) {
            this.router.navigate(['/login']);
            return false;
          } else {
            return true;
          }
        })
      );

  }


}