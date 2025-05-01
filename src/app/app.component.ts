import {Component, computed, inject, OnInit, resource, ResourceRef, Signal, signal, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {SubmitFileComponent} from './submit-file/submit-file.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FileServiceService} from './service/file-service.service';
import {SignalFileService} from './service/signal-file-service';
import {ResultQuestion} from './share/ResultQuestion';
import {SignalQuestionService} from './service/signal-question-service';
import {DocumentInfo} from './share/DocumentInfo';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SubmitFileComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  @ViewChild(SubmitFileComponent) submitcomponent?: SubmitFileComponent;
  private readonly fileService = inject(FileServiceService);
  readonly dialog = inject(MatDialog);
  readonly file = signal('');
  fileName: Signal<any>;
  resultQuestion: Signal<any>;
  documentInfos: DocumentInfo[] = [];


  formQuestion: FormGroup<{ question: FormControl<null> }>;
   result: ResultQuestion = {
    question: '', response: ''
  }
  protected files: ResourceRef<DocumentInfo | undefined> | undefined;

  constructor(private signalService: SignalFileService,
              private signalQuestionService: SignalQuestionService) {
    this.formQuestion = new FormGroup({
      question: new FormControl(null, Validators.required)
    })

    this.fileName = signalService.getSignal();
    this.resultQuestion = signalQuestionService.getSignal();
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
    var question = this.formQuestion.get('question')?.value

    this.resultQuestion = this.signalQuestionService.getSignal();
    this.formQuestion.reset();

    return this.fileService.rag(question);
  }

  ngOnInit(): void {

    this.fileService.getDocumentInfo();
    this.fileName = this.signalService.getSignal();

  }
}
