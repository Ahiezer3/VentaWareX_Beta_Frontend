import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterModel } from '../models/registerModel';
import { MyService } from './myService.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService extends MyService<RegisterModel>{

  constructor(http: HttpClient) {
    super(http);
    this.setEndpoint('auth/register');
  }

  register(registerModel: RegisterModel): Observable<any> {
    return this.create(registerModel);
  }

}
