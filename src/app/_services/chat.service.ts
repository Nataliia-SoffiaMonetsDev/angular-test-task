import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(private socket: Socket) { }

    public sendMessage(body): void {
        this.socket.emit('sendMessage', body);
    }

    public getAllMessages(): any {
        this.socket.emit('getAllMessages');
        return this.socket.fromEvent<any>('allMessages');
    }

    public getNewMessage(): Observable<any> {
        return this.socket.fromEvent<any>('newMessage');
    }
}
