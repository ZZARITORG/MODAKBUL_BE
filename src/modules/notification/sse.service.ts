import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private clients: Map<string, Subject<any>> = new Map();

  addClient(clientId: string) {
    const subject = new Subject<any>();
    this.clients.set(clientId, subject);
    return subject.asObservable();
  }

  removeClient(clientId: string) {
    this.clients.delete(clientId);
  }

  sendToClient(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (client) {
      client.next({ data });
    }
  }
}
