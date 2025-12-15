import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-my-header',
  standalone: true,
  imports: [],
  templateUrl: './my-header.component.html',
  styleUrl: './my-header.component.css'
})
export class MyHeaderComponent {
  @Input() titlePage:String = "";
  @Input() detailPage:String = "";
}
