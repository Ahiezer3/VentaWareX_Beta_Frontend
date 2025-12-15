import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavigateToService } from './navigate-to.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  pageWidth!: number;
  private pageElement!: ElementRef;
  private contentElement!: ElementRef;

  private menuOpenSubject = new BehaviorSubject<boolean>(false);
  menuOpen$ = this.menuOpenSubject.asObservable();
  
  constructor(private navigate: NavigateToService) { 
    this.menuOpenSubject.next(false);
  }

  toggleMenu() {
    this.menuOpenSubject.next(!this.menuOpenSubject.value);
    this.pageColumnsChange();

    this.blockScreenFromMenu();
  }

  navigateTo(path: string) {
    this.menuOpenSubject.next(false);
    this.blockScreen(false);
    this.navigate.navigateTo(path);
  }

  pageColumnsChange(){
    if (this.pageElement && this.pageElement.nativeElement) {

      if (this.menuOpenSubject.value) {
        this.pageElement.nativeElement.classList.add('columns-changed');
      } else {
        this.pageElement.nativeElement.classList.remove('columns-changed');
      }
    }
  }
     
  blockScreenFromMenu() {
    if (this.mobileScreen()) {
      this.blockScreen(this.menuOpenSubject.value);
    } else {
      this.blockScreen(false);
    }
  }

  mobileScreen():boolean {
    if(this.pageWidth <= 768) {
      return true;
    }

    return false;
  }

  blockScreen(block: boolean) {

    if (this.contentElement && this.contentElement.nativeElement) {
      if (block) {
        this.contentElement.nativeElement.classList.add('blocked');
      } else {
        this.contentElement.nativeElement.classList.remove('blocked');
      }
    } else {
      console.error('Content element is not set.');
    }

  }

  setPageElement(page: ElementRef) {
    this.pageElement = page;
  }

  setContentElement(content: ElementRef) {
    this.contentElement = content;
  }

  setMenuOpenSubject(menuOpenSubject:boolean) {
    this.menuOpenSubject.next(menuOpenSubject);
  }

  setPageWidth(pageWidth: number) {
    this.pageWidth = pageWidth;
  }
}
