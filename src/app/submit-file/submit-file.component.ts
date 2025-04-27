import {Component, computed, inject, resource, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MatDialog, MatDialogModule, MatDialogRef
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FileServiceService} from '../service/file-service.service';
import {of} from 'rxjs';
import {SignalFileService} from '../service/signal-file-service';


@Component({
  selector: 'app-submit-file',
  imports: [
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatDialogModule
  ],
  templateUrl: './submit-file.component.html',
  standalone: true,
  styleUrl: './submit-file.component.scss',
  providers: [FileServiceService]
})
export class SubmitFileComponent {

  private readonly fileService = inject(FileServiceService);
  readonly dialogRef = inject(MatDialogRef<SubmitFileComponent>);

  readonly file = signal('');
  readonly dialog = inject(MatDialog);
  formFields: FormGroup;
  selectedfile: File | null = null;
  fileName = signal('');



  constructor(private signalService: SignalFileService) {
    this.formFields = new FormGroup({
        file: new FormControl(null, Validators.required)
    })
  }

  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log("savefile -->", input.files);
    if(input.files?.length){
      this.selectedfile = input.files[0];
    }

  }

  onSubmit(){
    console.log(this.selectedfile);
    if (this.selectedfile) {
      this.fileService.save(this.selectedfile).subscribe({
        next: (data) => {
          console.log('Data received:', data);
          this.signalService.setSignal(this.formFields.get('file')?.value);
          this.onNoClick();
        },
        error: (error) => {
          console.error('Error occurred:', error);
          this.onNoClick();
        },
        complete: () => {
          console.log('Observable completed');
          this.onNoClick();
        }

      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  protected readonly of = of;
}
