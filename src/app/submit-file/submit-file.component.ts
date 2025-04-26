import {Component, computed, inject, resource, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MatDialog
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FileServiceService} from '../service/file-service.service';
import {of} from 'rxjs';



@Component({
  selector: 'app-submit-file',
  imports: [
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule
  ],
  templateUrl: './submit-file.component.html',
  standalone: true,
  styleUrl: './submit-file.component.scss',
  providers: [FileServiceService]
})
export class SubmitFileComponent {

  private readonly fileService = inject(FileServiceService);

  readonly file = signal('');
  readonly dialog = inject(MatDialog);
  formFields: FormGroup;
  selectedfile: File | null = null;

  public filesResource = resource({
    loader: () => {
      return fetch('http://localhost:8080/api/files/').then((res) => res.json() as Promise<File[]>);
    }
  })
  public files = computed( () => this.filesResource.value() || [] );

  constructor() {
    this.formFields = new FormGroup({
        file: new FormControl(null, Validators.required)
    })
  }

  openDialog(): void {
    console.log("modal open");
    const dialogRef = this.dialog.open(SubmitFileComponent, {
      data: {file: this.file},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.file.set(result);
      }
    });
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
        },
        error: (error) => {
          console.error('Error occurred:', error);
        },
        complete: () => {
          console.log('Observable completed');
        }

      });
    }
  }

  protected readonly of = of;
}
