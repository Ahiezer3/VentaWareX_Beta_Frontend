import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PaginationService } from '../../../services/pagination.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  private distroySuscriptions$: Subject<void> = new Subject<void>();
  
  limit = 30;
  totalPages = 0;
  currentPage = 1;
  maxVisiblePages = 5;
  pages: number[] = [];

  constructor(private paginationService:PaginationService) {
    // this.updateVisiblePages();

    this.paginationService.$totalPagesEvent.pipe(takeUntil(this.distroySuscriptions$)).subscribe((value) => {
      this.totalPages = value;
      this.updateVisiblePages();
    });

  }

  ngOnInit() {

  }

  ngOnDestroy() {

    this.distroySuscriptions$.next();
    this.distroySuscriptions$.complete();

  }

  updateVisiblePages() {
    this.pages = this.getVisiblePages(this.totalPages, this.currentPage, this.maxVisiblePages);
  }

  goToPage(page: number) {

    this.currentPage = page;

    this.paginationService.setCurrentPage(this.currentPage);

    // this.updateVisiblePages();
  
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      // this.updateVisiblePages();
      this.paginationService.setCurrentPage(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      // this.updateVisiblePages();
      this.paginationService.setCurrentPage(this.currentPage);
    }
  }

  getVisiblePages(totalPages: number, currentPage: number, maxVisiblePages: number = 5): number[] {
    let startPage: number, endPage: number;
    
    // Si el total de páginas es menor o igual al máximo visible, mostrar todas las páginas
    if (totalPages <= maxVisiblePages) {
        startPage = 1;
        endPage = totalPages;
    } else {
        // Determinar el punto medio
        const half = Math.floor(maxVisiblePages / 2);

        if (currentPage <= half) {
            // Si estamos en los primeros números, mostramos desde la primera página
            startPage = 1;
            endPage = maxVisiblePages;
        } else if (currentPage + half >= totalPages) {
            // Si estamos en las últimas páginas, mostramos las últimas `maxVisiblePages`
            startPage = totalPages - maxVisiblePages + 1;
            endPage = totalPages;
        } else {
            // Si estamos en el medio, desplazamos las páginas
            startPage = currentPage - half;
            endPage = currentPage + half;
        }
    }

    // Generar el array de páginas visibles
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

}


