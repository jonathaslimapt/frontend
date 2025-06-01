import {computed, inject, Injectable, resource, ResourceRef, signal} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DocumentInfo} from '../share/DocumentInfo';
import {SignalFileService} from '../factory/signal-file-service';
import {SignalQuestionService} from '../factory/signal-question-service';
import {ResultQuestion} from '../share/ResultQuestion';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  private readonly http: HttpClient = inject(HttpClient);
  resultQuestion: ResultQuestion | any;
  documentInfo: DocumentInfo[] | any;

  constructor(private signalService: SignalFileService, private signalQuestion: SignalQuestionService) { }

  // @ts-ignore
  getDocumentInfo(): DocumentInfo[] {
    this.http.get<any>("http://localhost:8080/ai/files", {responseType: "text" as 'json'}).subscribe(
      (result: any) => {
        this.documentInfo = JSON.parse(result);

        this.signalService.setSignal(this.documentInfo[0].metadata.file_name);
      },
    );
  }


  save(file: File) {

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "multipart/form-data"
      })
    };

    var formData = new FormData();
    formData.append('file', file);

    return this.http.post("http://localhost:8080/ai", formData, {responseType: "text"});
  }

  rag(question: any){

    const resultQuestion: ResultQuestion = {
      response: "",
      question: ""
    };

    const params = new HttpParams().set('query', question);
    this.http.get<any>("http://localhost:8080/ai/rag", {params, responseType: "text" as 'json'}).subscribe(
      (result: any) => {
        resultQuestion.response = result;
        resultQuestion.question = question;

        this.signalQuestion.setSignal(resultQuestion);
        },
    );

    return this.resultQuestion;
  }

}
