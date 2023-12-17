import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  constructor() {}

  private subject: Subject<MessageEvent> | undefined;

  public connect(url: string): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
    }

    return this.subject;
  }

  private create(url: string): Subject<MessageEvent> {
    const ws = new WebSocket(url);

    const observable = new Subject<MessageEvent>();
    ws.onmessage = (event) => observable.next(event);
    ws.onerror = (event) => observable.error(event);
    ws.onclose = () => observable.complete();

    const observer = {
      next: (data: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      },
    };

    return Subject.create(observer, observable);
  }
}
