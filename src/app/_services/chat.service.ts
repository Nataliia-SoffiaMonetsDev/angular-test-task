import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { MessagesData, NotificationData } from '../shared/interfaces/data.interfaces';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(private socket: Socket) { }

    public sendMessage(body: MessagesData): void {
        this.socket.emit('sendMessage', body);
    }

    public getAllMessages(): Observable<MessagesData[]> {
        this.socket.emit('getAllMessages');
        return this.socket.fromEvent<MessagesData[]>('allMessages');
    }

    public getNewMessage(): Observable<MessagesData> {
        return this.socket.fromEvent<MessagesData>('newMessage');
    }

    public getExternalUserMessage(): Observable<MessagesData> {
        return this.socket.fromEvent<MessagesData>('alertMessage');
    }

    public getAllNotifications(): Observable<NotificationData[]> {
        return this.socket.fromEvent<NotificationData[]>('getAllNotifications');
    }

    public requestAllNotifications(): void {
        this.socket.emit('getNotifications', {});
    }

    public deleteNotification(recipientId: string, messageId: string) {
        this.socket.emit('deleteNotification', recipientId, messageId);
    }

    public getNotificationsAfterDelete(): Observable<NotificationData[]> {
        return this.socket.fromEvent<NotificationData[]>('allNotificationsAfterDelete');
    }

    public clearAllNotifications(recipientId: string): void {
        this.socket.emit('deleteAllNotifications', recipientId);
    }
}
