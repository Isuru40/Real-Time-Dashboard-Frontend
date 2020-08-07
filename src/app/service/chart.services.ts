import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import {  Subject } from 'rxjs';
import { Injectable } from '@angular/core';

export class ChatService {
  private url = 'https://nodeserver-bind.azurewebsites.net/';
  private socket:any;



  sendMessage(message1) {
    this.socket.emit('add-message', message1);
    console.log("MESSAGE SENT");
  }

  getLiveData1() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {

        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    })
    return observable;
  }
  getLiveData2() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('sampleMessage', (data) => {

        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    })
    return observable;
  }

  public readonly responses: Subject<string> = new Subject<string>();

  public submit(question: string): void {
    const length = question.length;
    const answer = `"${question}" contains exactly ${length} symbols.`;

    setTimeout(
      () => this.responses.next(answer),
      1000
    );
  }
}
