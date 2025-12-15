import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { MyHeaderComponent } from '../my-header/my-header.component';
import { CommonModule } from '@angular/common';
import { SaleService } from '../../services/sale.service';
import { SpinnerService } from '../../services/spinner.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { ToolService } from '../../services/tool.service';
import { Subject, takeUntil } from 'rxjs';
import { NavigateToService } from '../../services/navigate-to.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
  imports: [MyHeaderComponent, CommonModule],
  standalone: true
})
export class TicketComponent implements OnInit {
  
  private distroySuscriptions$: Subject<void> = new Subject<void>();

  @ViewChild('ticket', { static: false }) ticketElement!: ElementRef;

  titlePage ="Ticket de venta";
  detailPage = "Detalles de la venta";

  ticketData:any | undefined;

  keySale:number | undefined;

  constructor(private saleService:SaleService, 
    private spinnerService: SpinnerService, 
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private tool: ToolService,
    private navigateTo:NavigateToService,
    private renderer: Renderer2){}

  ngOnInit() {

    this.activatedRoute.paramMap.pipe(takeUntil(this.distroySuscriptions$)).subscribe(params => {
        const id = params.get('id');
        this.keySale = id ? parseInt(id) : undefined;
    });

    this.placeTicket();
  }

  ngOnDestroy() {
    this.distroySuscriptions$.next();
    this.distroySuscriptions$.complete();
  }

  formatNumber(number:number) {
    return this.tool.formatNumber(number,true);
  }

  formatDate(date:string) {
    return this.tool.formatDate(new Date(date));
  }

  placeTicket() {

    this.spinnerService.show();

    this.saleService.find(this.keySale??-1).pipe(takeUntil(this.distroySuscriptions$)).subscribe({
      
      next: (res: any) => {
        
        this.ticketData = res.data;

        this.spinnerService.hide();

      },
      error: (err: { message: string; }) => {
        console.log(err);
        this.spinnerService.hide();

        this.toastService.setMessageToast(err.message);
        this.toastService.emitShowEvent();
      }

    });

  }

  printTicket() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      this.printTicketMobile();
    } else {
      this.printTicketPc();
    }
  }

  printTicketPc() {

    const ticketElement = this.ticketElement.nativeElement;

    if (ticketElement) {
      const originalContent = document.body.innerHTML;
  
      // Solo muestra el ticket
      document.body.innerHTML = ticketElement.outerHTML;
  
      // Ejecuta la impresión
      window.print();
  
      // Restaura el contenido original de la página
      document.body.innerHTML = originalContent;
      window.location.reload();  // Recarga para restaurar el estado de Angular

    }
  }

  printTicketMobile() {
    
 
  }

  generatePDF(): void {
 
    this.spinnerService.show();
    this.removeStylesTicket();

    try {

      const element = this.ticketElement.nativeElement;
  
      html2canvas(element, { scale: 4 }).then(async (canvas) => {

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
  
        const ticketWidth = 2.5 * 25.4; // 2.5 in -> mm (63.5mm)
        const ticketHeight = canvas.height * (ticketWidth / canvas.width); // Escalar para mantener la proporción  

        pdf.addImage(imgData, 'PNG', 0, 0, ticketWidth, ticketHeight);

        let nameFile = 'venta-' + this.ticketData.key + '.pdf';

        pdf.save(nameFile);

      }).catch((error) => {
        throw new Error(error);
      });

    } catch (error) {
      console.error('Error in generatePDF method:', error);
      this.toastService.setMessageToast("No fue posible descargar el ticket.");
      this.toastService.emitShowEvent();
    } finally {

      this.applyStylesTicket();

      setTimeout(()=>{
        this.spinnerService.hide();
      },1000);
 
    }
  }  

  // Método para abrir el archivo PDF usando un visor externo
  async openPdf(nameFile: string) {
   
  }

  applyStylesTicket(): void {
    const ticket = this.ticketElement.nativeElement;

    this.renderer.setStyle(ticket, 'border', '1px solid #ddd');
    this.renderer.setStyle(ticket, 'box-shadow', '0 0 10px rgba(0, 0, 0, 0.1)');
    this.renderer.setStyle(ticket, 'background-color', '#f9f9f9');
  }

  removeStylesTicket(): void {
    const ticket = this.ticketElement.nativeElement;

    this.renderer.setStyle(ticket, 'border', 'none');
    this.renderer.setStyle(ticket, 'box-shadow', 'none');
    this.renderer.setStyle(ticket, 'background-color', '#fff');
  }

}
