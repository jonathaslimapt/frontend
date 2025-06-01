import {Injectable, signal} from '@angular/core';
import { Signal } from '@angular/core';  // Exemplo, dependendo da versão do Angular

@Injectable({
  providedIn: 'root'
})
export class SignalFileService {
  private signalValue = signal('');

  getSignal(): Signal<any> {
    return this.signalValue;
  }

  setSignal(value: string): void {
    this.signalValue.set(value);
  }
}
