import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements AfterViewInit{

  private distroySuscriptions$: Subject<void> = new Subject<void>();
  
  titleToast = "";
  messageToast = "";

  @ViewChild('liveToast') liveToast: ElementRef | undefined;

  constructor(private toastService: ToastService, private cdr: ChangeDetectorRef, private renderer: Renderer2) {}

  ngAfterViewInit() {

  }

  ngOnInit(): void {

    this.toastService.titleToastEvent$.pipe(takeUntil(this.distroySuscriptions$)).subscribe((title) => {
      this.titleToast = title;
      this.cdr.detectChanges();
    });

    this.toastService.messageToastEvent$.pipe(takeUntil(this.distroySuscriptions$)).subscribe((message) => {
      this.messageToast = message;
      this.cdr.detectChanges();
    });

    this.toastService.showEvent$.pipe(takeUntil(this.distroySuscriptions$)).subscribe(() => {
      this.onShow();
      this.cdr.detectChanges();

      setTimeout(() => {
        this.onClose();
      },5000);
      
    });
  }

  ngOnDestroy() {
    this.distroySuscriptions$.next();
    this.distroySuscriptions$.complete();
  }

  onShow() {
    if (this.liveToast && this.liveToast.nativeElement) {
      this.renderer.setStyle(this.liveToast?.nativeElement, 'display', 'flex');
    }
  }

  onClose() {
    if (this.liveToast && this.liveToast.nativeElement) {
      this.renderer.setStyle(this.liveToast?.nativeElement, 'display', 'none');
    }
  }
}

