import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import { Signal } from '@angular/core';
import {ResultQuestion} from '../share/ResultQuestion';  // Exemplo, dependendo da versão do Angular

@Injectable({
  providedIn: 'root'
})
export class SignalQuestionService {
  question = signal('');
  response = signal('');
  signaQuestionlValue: WritableSignal<ResultQuestion> = signal(
    {
      question: '',
      response: ''
    }
  );
  fullName = computed(() => `${this.question()} ${this.response()}`);

  getSignal(): Signal<any> {
    return this.signaQuestionlValue;
  }

  setSignal(value: ResultQuestion): void {
    this.signaQuestionlValue.set(value);
  }

  getFullInfo(){
    return this.fullName;
  }
}
