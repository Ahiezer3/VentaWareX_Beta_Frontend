import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-other',
  standalone: true,
  imports: [],
  templateUrl: './other.component.html',
  styleUrl: './other.component.css'
})
export class OtherComponent {

  constructor(private spinnerService:SpinnerService) {

  }

  ngOnInit() {  
    this.spinnerService.hide();
  }
}
