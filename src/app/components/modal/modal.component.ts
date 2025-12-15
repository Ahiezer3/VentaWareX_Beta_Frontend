import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

    private distroy$: Subject<void> = new Subject<void>();

    titleModal = "";
    messageModal = "";

    constructor(private modalService: ModalService, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {

      this.modalService.titleModalEvent$.pipe(takeUntil(this.distroy$)).subscribe((title) => {
        this.titleModal = title;
        this.cdr.detectChanges();
      });

      this.modalService.messageModalEvent$.pipe(takeUntil(this.distroy$)).subscribe((message) => {
        this.messageModal = message;
        this.cdr.detectChanges();
      });

    }

    ngOnDestroy() {
      this.distroy$.next();
      this.distroy$.complete();
    }

    onConfirm() {
      this.modalService.emitConfirmEvent();
    }

  }
