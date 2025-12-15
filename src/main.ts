import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/components/app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from './app/auth.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    { provide: HTTP_INTERCEPTORS, useClass:MyInterceptor, multi: true },
  ]
}).catch((err) => console.error(err));