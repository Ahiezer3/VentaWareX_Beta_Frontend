import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyService<T> {
  
  httpClient: HttpClient;

  URL: string = "http://localhost:8080/";

  ENDPOINT: string = "";

  constructor(private http: HttpClient) {
    this.httpClient = http;
  }

  findAll(): Observable<any> {
    return this.myResponse(
      this.http.get<T>(this.getUrlComplete())
    );
  }

  findAllPaginated(page:string, limit:string): Observable<any> {
    return this.myResponse(
      this.http.get<T>(this.getUrlComplete()+"findAllPaginated?page="+page+"&limit="+limit)
    );
  }

  find(id:number): Observable<any> {
    return this.myResponse(
      this.http.get<T>(this.getUrlComplete()+id)
    );
  }

  create(product: T): Observable<any> {

    return this.myResponse(
      this.http.post<any>(this.getUrlComplete(), product)
    );

  }

  update(id:number, product:T): Observable<any> {
    return this.myResponse(
      this.http.patch<any>(this.getUrlComplete() + id, product)
    );
  }

  remove(id:number): Observable<any> {
    return this.myResponse(
      this.http.delete<T>(this.getUrlComplete()+id)
    );
  }

  myResponse<T>(response: Observable<any>): Observable<T> {

    return response.pipe(

        map(res => {
          if (!res.success) {
            throw new Error(res.message);
          }
          return res;
        }),
        catchError(error => {
          console.error('error', error.message);
          throw new Error(error.message);
        })
      
    );

  }

  setEndpoint(endpoint:string) {
    this.ENDPOINT = endpoint;
  }

  getHttpClient() {
    return this.httpClient;
  }
  
  getUrlComplete():string {
    return this.URL + this.ENDPOINT;
  }
}
