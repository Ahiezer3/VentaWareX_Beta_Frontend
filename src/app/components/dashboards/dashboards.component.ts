import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToolService } from '../../services/tool.service';
import { DashboardsService } from '../../services/dashboards.service';
import { FormsModule } from '@angular/forms';

import Chart from 'chart.js/auto';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-dashboards',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './dashboards.component.html',
  styleUrl: './dashboards.component.css'
})
export class DashboardsComponent {

  private distroySubscriptions$: Subject<void> = new Subject<void>();

  totalSummaryToday: string = "$0.00";
  totalGainSummaryToday: string = "$0.00";

  totalSummaryMonth: string = "$0.00";
  totalGainSummaryMonth: string = "$0.00";

  public totalByDayCurrentMonth: Chart | undefined;

  public totalByDayByDateRange: Chart | undefined;

  public totalByMonthForYear: Chart | undefined;

  public totalByMonthForYearGain: Chart | undefined;
  
  @ViewChild('monthTotalByDayCurrentMonth') monthTotalByDayCurrentMonth! : ElementRef;

  @ViewChild('startTotalByDayByDateRange') startTotalByDayByDateRange!: ElementRef;

  @ViewChild('endTotalByDayByDateRange') endTotalByDayByDateRange!: ElementRef;

  yearsFilter:any[] = [];
  
  yearTotalByMonthForYear!: number;

  
  constructor(private dashboardService:DashboardsService, private toolService:ToolService, private spinnerService: SpinnerService){}

  ngOnInit(): void {
    
    this.totalByDayCurrentMonth = new Chart("totalByDayCurrentMonth",{
      type:"line",
      data : {
        labels: [],
        datasets: [{
          label: 'Total MXN',
          data: [],
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Total ganancia MXN',
          data: [],
          fill: true,
          borderColor: 'rgb(75, 100, 152)',
          tension: 0.1
        }]
      }
    });

    this.totalByDayByDateRange = new Chart("totalByDayByDateRange",{
      type:"line",
      data : {
        labels: [],
        datasets: [{
          label: 'Total MXN',
          data: [],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Total ganancia MXN',
          data: [],
          fill: false,
          borderColor: 'rgb(75, 100, 152)',
          tension: 0.1
        }]
      }
    });

    this.totalByMonthForYear = new Chart("totalByMonthForYear",{
      type: 'bar',
      data: {
        labels: [],
        datasets:  [{
          label: 'Total MXN',
          data: [],
          backgroundColor: [
            'rgba(75, 192, 192)',
            'rgba(75, 192, 192)',
            'rgba(75, 192, 192)',
            'rgba(75, 192, 192)',
            'rgba(75, 192, 192)',
            'rgba(75, 192, 192)',
            'rgba(75, 192, 192)',
            'rgba(75, 192, 192)',
            'rgba(75, 192, 192)',
            'rgba(75, 192, 192)',
            'rgba(75, 192, 192)',
            'rgba(75, 192, 192)',
          ],
          borderColor: [
            'rgb(75, 192, 192)',
            'rgb(75, 192, 192)',
            'rgb(75, 192, 192)',
            'rgb(75, 192, 192)',
            'rgb(75, 192, 192)',
            'rgb(75, 192, 192)',
            'rgb(75, 192, 192)',
            'rgb(75, 192, 192)',
            'rgb(75, 192, 192)',
            'rgb(75, 192, 192)',
            'rgb(75, 192, 192)',
            'rgb(75, 192, 192)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });

    this.totalByMonthForYearGain = new Chart("totalByMonthForYearGain",{
      type: 'bar',
      data: {
        labels: [],
        datasets:  [{
          label: 'Total ganancia MXN',
          data: [],
          backgroundColor: [
            'rgba(75, 100, 152)',
            'rgba(75, 100, 152)',
            'rgba(75, 100, 152)',
            'rgba(75, 100, 152)',
            'rgba(75, 100, 152)',
            'rgba(75, 100, 152)',
            'rgba(75, 100, 152)',
            'rgba(75, 100, 152)',
            'rgba(75, 100, 152)',
            'rgba(75, 100, 152)',
            'rgba(75, 100, 152)',
            'rgba(75, 100, 152)',
          ],
          borderColor: [
            'rgb(75, 100, 152)',
            'rgb(75, 100, 152)',
            'rgb(75, 100, 152)',
            'rgb(75, 100, 152)',
            'rgb(75, 100, 152)',
            'rgb(75, 100, 152)',
            'rgb(75, 100, 152)',
            'rgb(75, 100, 152)',
            'rgb(75, 100, 152)',
            'rgb(75, 100, 152)',
            'rgb(75, 100, 152)',
            'rgb(75, 100, 152)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });

  }

  ngAfterViewInit () {

    this.spinnerService.show();

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const today = new Date().toLocaleDateString('en-CA'); // 'en-CA' formatea la fecha como 'YYYY-MM-DD'

    this.yearsFilter = this.dashboardService.generateYearsFilter();

    this.monthTotalByDayCurrentMonth.nativeElement.value = currentMonth.toString();
 
    this.startTotalByDayByDateRange.nativeElement.value = today;
    this.endTotalByDayByDateRange.nativeElement.value = today;

    this.yearTotalByMonthForYear = currentYear;

    this.loadTotalByDayCurrentMonth();

    this.loadTotalByDayByDateRange();

    this.loadTotalByMonthForYear();

    this.spinnerService.hide()
    
  }

  ngOnDestroy() {

    this.distroySubscriptions$.next();
    this.distroySubscriptions$.complete();

  }

  loadTotalByDayCurrentMonth() {

    const month = this.monthTotalByDayCurrentMonth?.nativeElement?.value;

    this.dashboardService.getTotalByDayCurrentMonth(month)
    .pipe(takeUntil(this.distroySubscriptions$))
    .subscribe({
      next: async (data: any) => {
      
        if (this.totalByDayCurrentMonth) {

          if (data && data.labels && data.values) {
            this.totalByDayCurrentMonth.data.labels = data.labels;
            this.totalByDayCurrentMonth.data.datasets[0].data = data.values.valuesTotal;
            this.totalByDayCurrentMonth.data.datasets[1].data = data.values.valuesTotalGain;

            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();

            const todayFormat = day + "/" + month + "/" + year;

            const indexToday = data.labels.indexOf(todayFormat);

            if (indexToday != -1) {
              const totalSummaryTodayNumber = data.values.valuesTotal[indexToday];
              const totalGainSummaryTodayNumber = data.values.valuesTotalGain[indexToday];

              this.totalSummaryToday = this.toolService.formatCurrency(totalSummaryTodayNumber);
              this.totalGainSummaryToday = this.toolService.formatCurrency(totalGainSummaryTodayNumber);
            }

            let totalSummaryMonthNumber: number = 0;
            let totalGainSummaryMonthNumber: number = 0;

            data.values.valuesTotal.forEach((element: number) => {
             totalSummaryMonthNumber = Number(totalSummaryMonthNumber) + Number(element);
            });

            data.values.valuesTotalGain.forEach((element: number) => {
              totalGainSummaryMonthNumber = Number(totalGainSummaryMonthNumber) + Number(element);
            });

            this.totalSummaryMonth = this.toolService.formatCurrency(totalSummaryMonthNumber);
            this.totalGainSummaryMonth = this.toolService.formatCurrency(totalGainSummaryMonthNumber);
            
          } else {
            this.totalByDayCurrentMonth.data.labels = [];
            this.totalByDayCurrentMonth.data.datasets[0].data = [];
            this.totalByDayCurrentMonth.data.datasets[1].data = [];
          }

          this.totalByDayCurrentMonth.update();
        }

      },
      error: (err: any) => console.error(err)
    });
  }

  loadTotalByDayByDateRange() {

    const startDateLocal = this.startTotalByDayByDateRange.nativeElement?.value ? new Date(this.startTotalByDayByDateRange.nativeElement.value) : null;
    const endDateLocal = this.endTotalByDayByDateRange.nativeElement?.value ? new Date(this.endTotalByDayByDateRange.nativeElement.value) : null;
  
    const startDateUTC = startDateLocal ? this.toolService.convertDateToUtc(startDateLocal) : "";
    const endDateUTC = endDateLocal ? this.toolService.convertDateToUtc(endDateLocal) : "";
  
    if (startDateUTC && endDateUTC) {

      this.dashboardService.getTotalByDayByDateRange(startDateUTC.toString(), endDateUTC.toString())
      .pipe(takeUntil(this.distroySubscriptions$))
      .subscribe({
        next: (data: any) => {

          if (this.totalByDayByDateRange) {

            if (data && data.labels && data.values) {
              this.totalByDayByDateRange.data.labels = data.labels;
              this.totalByDayByDateRange.data.datasets[0].data = data.values.valuesTotal;
              this.totalByDayByDateRange.data.datasets[1].data = data.values.valuesTotalGain;
            } else {
              this.totalByDayByDateRange.data.labels = [];
              this.totalByDayByDateRange.data.datasets[0].data = [];
              this.totalByDayByDateRange.data.datasets[1].data = [];
            }
  
            this.totalByDayByDateRange.update();
          }

        },
        error: (err: any) => console.error(err)
      });
    } else {

      if (this.totalByDayByDateRange) {
        this.totalByDayByDateRange.data.labels = [];
        this.totalByDayByDateRange.data.datasets[0].data = [];

        this.totalByDayByDateRange.update();
      }

    }
  }

  loadTotalByMonthForYear() {

    const year = this.yearTotalByMonthForYear | new Date().getFullYear();

    this.dashboardService.getTotalByMonthForYear(year)
      .pipe(takeUntil(this.distroySubscriptions$))
      .subscribe({
        next: (data: any) => {
        
          if (this.totalByMonthForYear && this.totalByMonthForYearGain) {
            if (data && data.labels && data.values) {
              this.totalByMonthForYear.data.labels = data.labels;
              this.totalByMonthForYearGain.data.labels = data.labels;
              this.totalByMonthForYear.data.datasets[0].data = data.values.valuesTotal;
              this.totalByMonthForYearGain.data.datasets[0].data = data.values.valuesTotalGain;
            } else {
              this.totalByMonthForYear.data.labels = [];
              this.totalByMonthForYearGain.data.labels = [];
              this.totalByMonthForYear.data.datasets[0].data = [];
              this.totalByMonthForYearGain.data.datasets[0].data = [];
            }
          }
          this.totalByMonthForYear?.update();
          this.totalByMonthForYearGain?.update();
        },
        error: (err: any) => console.error(err)
      });
  }

}
