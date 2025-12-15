import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  private currentPageEventSubject = new BehaviorSubject<number>(1);
  $currentPageEvent = this.currentPageEventSubject.asObservable();

  private totalPagesEventSubject = new BehaviorSubject<number>(1);
  $totalPagesEvent = this.totalPagesEventSubject.asObservable();

  constructor() {
    this.resetValues();
  }

  setCurrentPage(currentPage: number) {
    this.currentPageEventSubject.next(currentPage);
  }
  
  setTotalPages(totalPages: number) {
    totalPages = totalPages || 5;
    this.totalPagesEventSubject.next(totalPages);
  }

  resetValues() {
    this.currentPageEventSubject.next(1);
    this.totalPagesEventSubject.next(1);
  }
}
