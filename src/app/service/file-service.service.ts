import {computed, inject, Injectable, resource} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  private readonly http: HttpClient = inject(HttpClient);
  resultQuestion = [];

  constructor() { }

  public filesResource = resource({
    loader: async () => {
      const res = await fetch('http://localhost:8080/ai/files');
      return await (res.json() as Promise<boolean>);
    }
  })
  public files = computed( () => this.filesResource.value() || [] );

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

    const params = new HttpParams().set('query', question);
    this.http.get<any>("http://localhost:8080/ai/rag", {params, responseType: "text" as 'json'}).subscribe(
      (result: any) => {
        this.resultQuestion = result;
        },
    );

    console.log(this.resultQuestion);
    return this.resultQuestion;
  }

}
