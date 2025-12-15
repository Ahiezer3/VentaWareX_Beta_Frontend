import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigateToService } from '../../services/navigate-to.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private navigate: NavigateToService, private spinnerService: SpinnerService) {

  }

  ngOnInit() {
    this.spinnerService.hide();
  }

  navigateTo(path: string): void {
    this.navigate.navigateTo(path);
  }
}
