import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private titleModalEventSubject = new BehaviorSubject<string>('');
  titleModalEvent$ = this.titleModalEventSubject.asObservable();

  private messageModalEventSubject = new BehaviorSubject<string>('');
  messageModalEvent$ = this.messageModalEventSubject.asObservable();

  private confirmEventSubject = new Subject<void>();
  confirmEvent$ = this.confirmEventSubject.asObservable();

 
  constructor() { }

  setTitleModal(title:string) {
    this.titleModalEventSubject.next(title);
  }

  setMessageModal(messageModal:string){
    this.messageModalEventSubject.next(messageModal);
  }

  emitConfirmEvent() {
    this.confirmEventSubject.next();
  }

}
