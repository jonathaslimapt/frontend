import {Component, computed, inject, OnInit, resource, ResourceRef, Signal, signal, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {SubmitFileComponent} from './submit-file/submit-file.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FileServiceService} from './service/file-service.service';
import {SignalFileService} from './factory/signal-file-service';
import {ResultQuestion} from './share/ResultQuestion';
import {SignalQuestionService} from './factory/signal-question-service';
import {DocumentInfo} from './share/DocumentInfo';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  @ViewChild(SubmitFileComponent) submitcomponent?: SubmitFileComponent;
  private readonly fileService = inject(FileServiceService);
  readonly dialog = inject(MatDialog);
  readonly file = signal('');
  fileName!: Signal<string>;
  resultQuestion!: Signal<ResultQuestion>;

  formQuestion: FormGroup<{ question: FormControl<null> }>;

  constructor(private signalFileService: SignalFileService,
              private signalQuestionService: SignalQuestionService) {

    this.formQuestion = new FormGroup({
      question: new FormControl(null, Validators.required)
    })


  }

  ngOnInit(): void {

    this.resultQuestion = this.signalQuestionService.getSignal();
    this.fileService.getDocumentInfo();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SubmitFileComponent, {
      data: {name: this.file}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.file.set(result);
      }
    });
  }

  onSubmit() {
    this.fileService.rag(this.formQuestion.get('question')?.value);

    this.fileName = this.signalFileService.getSignal();
    this.resultQuestion = this.signalQuestionService.getSignal();
  }


}
