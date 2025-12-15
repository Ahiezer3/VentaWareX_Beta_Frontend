import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service.service';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';

export const authGuardLogin: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        router.navigateByUrl('/home');
        return false;
      } else {
        return true;
      }
    })
  );
};
