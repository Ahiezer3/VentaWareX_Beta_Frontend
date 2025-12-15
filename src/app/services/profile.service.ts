import { Injectable } from '@angular/core';
import { ProfileModel } from '../models/profileModel';
import { MyService } from './myService.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends MyService<ProfileModel>{

  constructor(http: HttpClient) {
    super(http);
    this.setEndpoint('users/');
  }

  getData(urlEndpoint: string) {

    const url = this.getUrlComplete() + urlEndpoint;

    return this.myResponse(
      this.getHttpClient().get<ProfileModel>(url)
    );
  }

  updateProfile(profile:ProfileModel): Observable<any> {
    return this.myResponse(
      this.getHttpClient().patch<any>(this.getUrlComplete(), profile)
    );
  }

}
