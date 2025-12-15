import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { AuthService } from '../../auth-service.service';
import { FormsModule } from '@angular/forms'
import { isPlatformBrowser } from '@angular/common';
import { SpinnerService } from '../../services/spinner.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  remember : boolean = false;

  email: string = "";
  password: string = "";

  constructor(private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object, private spinnerService: SpinnerService, private router: Router) {

    if (this.authService.isLoged()) {
      this.router.navigate(['/home']);
    }

    this.load();
  }

  ngOnInit() {
    this.spinnerService.hide();
  }

  ngAfterViewInit() {
    
  }

  load() {

    if (isPlatformBrowser(this.platformId)) {
    
      const email = localStorage.getItem('email');
      const pas = localStorage.getItem('pas');
      const remember = localStorage.getItem('remember');

      if(remember == "true") {
        this.email = email || "";
        this.password = pas || "";
        this.remember = email ? true : false;

        const myEvent : Event = new Event("");
        this.validateRemember(myEvent);
      }
    }

  }
  
  login() {
    this.authService.login(this.email, this.password);
  }

  validateRemember(event:Event) {

    if (this.remember) {

      if (this.email){
        localStorage.setItem('email',this.email);
      } else {
        localStorage.removeItem('email');
      }

      if (this.email && this.password){
        localStorage.setItem('pas', this.password);
      } else {
        localStorage.removeItem('pas');
      }
    
      localStorage.setItem('remember', "true");

    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('pas');
      localStorage.removeItem('remember');
      
    }
  }
}
