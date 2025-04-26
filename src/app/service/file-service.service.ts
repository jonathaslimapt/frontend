import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  private readonly http: HttpClient = inject(HttpClient);


  constructor() { }

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

}
