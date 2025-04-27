import {Component, computed, inject, OnInit, resource, ResourceRef, Signal, signal, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {SubmitFileComponent} from './submit-file/submit-file.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FileServiceService} from './service/file-service.service';
import {SignalFileService} from './service/signal-file-service';
import {ResultQuestion} from './share/ResultQuestion';
import {SignalQuestionService} from './service/signal-question-service';


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
  files: ResourceRef<boolean | undefined> | undefined;

  formQuestion: FormGroup<{ question: FormControl<null> }>;
   result: ResultQuestion = {
    question: '', response: ''
  }

  constructor(private signalService: SignalFileService,
              private signalQuestionService: SignalQuestionService) {
    this.formQuestion = new FormGroup({
      question: new FormControl(null, Validators.required)
    })

    this.fileName = signalService.getSignal();
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
    console.log(question)

    this.result.question = question || '';
    this.result.response = this.fileService.rag(question).toString() || '';

    this.signalQuestionService.setSignal(this.result);
    return this.fileService.rag(question);
  }

  ngOnInit(): void {
     this.files = this.fileService.filesResource;
  }
}
