import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private clients: Map<string, Subject<any>> = new Map();

  addClient(clientId: string) {
    const subject = new Subject<any>();
    this.clients.set(clientId, subject);
    console.log(`Client ${clientId} subscribed`); // 구독된 사용자 로그 출력
    this.printSubscribedClients();
    return subject.asObservable();
  }

  removeClient(clientId: string) {
    this.clients.delete(clientId);
  }
  // 구독된 사용자 목록 출력
  private printSubscribedClients() {
    const subscribedClients = Array.from(this.clients.keys());
    console.log('Currently subscribed clients:', subscribedClients);
  }
  sendToClient(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (client) {
      console.log(`Sending event to client: ${clientId}, data:`, data); // 로그 추가
      client.next({ data });
    } else {
      console.log(`Client not found: ${clientId}`); // 클라이언트가 없으면 로그 출력
    }
  }
}
