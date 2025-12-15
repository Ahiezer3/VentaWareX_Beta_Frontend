import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  private titleToastEventSubject = new BehaviorSubject<string>('');
  titleToastEvent$ = this.titleToastEventSubject.asObservable();

  private messageToastEventSubject = new BehaviorSubject<string>('');
  messageToastEvent$ = this.messageToastEventSubject.asObservable();

  private showEventSubject = new Subject<void>();
  showEvent$ = this.showEventSubject.asObservable();

  constructor() { }

  setTitleToast(title:string) {
    this.titleToastEventSubject.next(title);
  }

  setMessageToast(messageModal:string){
    this.messageToastEventSubject.next(messageModal);
  }

  emitShowEvent() {
    this.showEventSubject.next();
  }
}
