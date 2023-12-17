import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for managing WebSocket connections.
 */
export class WebsocketService {
  constructor() {}

  private subject: Subject<MessageEvent> | undefined;

  /**
   * Connects to the specified WebSocket URL.
   * If a connection has already been established, returns the existing subject.
   * @param url The WebSocket URL to connect to.
   * @returns The subject representing the WebSocket connection.
   */
  public connect(url: string): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
    }

    return this.subject;
  }

  /**
   * Creates a WebSocket connection and returns a Subject that can be used to send and receive messages.
   * @param url The URL of the WebSocket server.
   * @returns A Subject that emits incoming messages and allows sending messages to the server.
   */
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
