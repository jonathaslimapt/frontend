import {Component, inject, signal, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {SubmitFileComponent} from './submit-file/submit-file.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SubmitFileComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {

  @ViewChild(SubmitFileComponent) submitcomponent?: SubmitFileComponent;
}
