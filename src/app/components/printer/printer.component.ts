import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-printer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './printer.component.html',
  styleUrl: './printer.component.css'
})
export class PrinterComponent {

  constructor() {}

  printText() {
    // Printer.print({ content: 'Esta es una prueba de impresion...'})
  }

  printHtml() {
    // Printer.print({ content: '<h1>Esta es una prueba de impresion</h1>'})
  }

}
