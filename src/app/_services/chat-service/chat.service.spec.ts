import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { Socket, SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { MessagesData, NotificationData } from 'src/app/shared/interfaces/data.interfaces';
import { of } from 'rxjs';
import { ChatService } from './chat.service';

const config: SocketIoConfig = { url: environment.apiUrl, options: {} }

describe('ChatService', () => {
    let chatService: ChatService;
    let socket: Socket;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SocketIoModule.forRoot(config)
            ],
            providers: [
                ChatService
            ],
        });

        chatService = TestBed.inject(ChatService);
        socket = TestBed.inject(Socket);
    });

    it('ProductService successfully created', () => {
        expect(chatService).toBeDefined();
    });

    it('Send message with socket', () => {
        const messageData = {
            date: '7 Jul 3:11 PM',
            message: 'message',
            userName: 'Name',
        };
        const emit = jest.spyOn(socket, 'emit');
        chatService.sendMessage(messageData);
        expect(emit).toHaveBeenCalledWith('sendMessage', messageData);
    });

    it('Request and get all messages', () => {
        const emit = jest.spyOn(socket, 'emit');
        chatService.getAllMessages();
        expect(emit).toHaveBeenCalledWith('getAllMessages');
        const messagesData: MessagesData[] = [
            {
                date: '7 Jul 3:11 PM',
                message: 'message',
                userName: 'Name',
            },
            {
                date: '8 Jul 3:11 PM',
                message: 'message1',
                userName: 'Test',
            }
        ];
        const event = of(messagesData);
        jest.spyOn(socket, 'fromEvent').mockReturnValue(event);
        chatService.getAllMessages().subscribe(data => {
            expect(data).toEqual(messagesData);
        });
        expect(socket.fromEvent).toHaveBeenCalledWith('allMessages');
    });

    it('Get new message', () => {
        const messageData: MessagesData = {
            date: '7 Jul 3:11 PM',
            message: 'message',
            userName: 'Name',
        }
        const event = of(messageData);
        jest.spyOn(socket, 'fromEvent').mockReturnValue(event);
        chatService.getNewMessage().subscribe(data => {
            expect(data).toEqual(messageData);
        });
        expect(socket.fromEvent).toHaveBeenCalledWith('newMessage');
    });

    it('Get external user new message', () => {
        const messageData: MessagesData = {
            date: '7 Jul 3:11 PM',
            message: 'message',
            userName: 'Name',
        }
        const event = of(messageData);
        jest.spyOn(socket, 'fromEvent').mockReturnValue(event);
        chatService.getExternalUserMessage().subscribe(data => {
            expect(data).toEqual(messageData);
        });
        expect(socket.fromEvent).toHaveBeenCalledWith('alertMessage');
    });

    it('Get all notififcations', () => {
        const notififcationsData: NotificationData[] = [
            {
                recipientId: '64a7cbc9c8b6a84165a50c8f',
                messages: [
                    {
                        date: '7 Jul 3:11 PM',
                        message: 'message',
                        userName: 'Name',
                        _id: '64abcdee4ec1b2bc7dd0ed55'
                    }
                ],
                _id: '64abcdee4ec1b2bc7dd0ed5b'
            }
        ];
        const event = of(notififcationsData);
        jest.spyOn(socket, 'fromEvent').mockReturnValue(event);
        chatService.getAllNotifications().subscribe(data => {
            expect(data).toEqual(notififcationsData);
        });
        expect(socket.fromEvent).toHaveBeenCalledWith('getAllNotifications');
    });

    it('Request all notififcations with socket emit', () => {
        const emit = jest.spyOn(socket, 'emit');
        chatService.requestAllNotifications();
        expect(emit).toHaveBeenCalledWith('getNotifications', {});
    });

    it('Delete a certain notififcation by id', () => {
        const recipientId = '64a7cbc9c8b6a84165a50c8f';
        const messageId = '64abcdee4ec1b2bc7dd0ed55';
        const emit = jest.spyOn(socket, 'emit');
        chatService.deleteNotification(recipientId, messageId);
        expect(emit).toHaveBeenCalledWith('deleteNotification', recipientId, messageId);
    });

    it('Get all notififcations after delete', () => {
        const notififcationsData: NotificationData[] = [
            {
                recipientId: '64a7cbc9c8b6a84165a50c8f',
                messages: [
                    {
                        date: '7 Jul 3:11 PM',
                        message: 'message',
                        userName: 'Name',
                        _id: '64abcdee4ec1b2bc7dd0ed55'
                    }
                ],
                _id: '64abcdee4ec1b2bc7dd0ed5b'
            }
        ];
        const event = of(notififcationsData);
        jest.spyOn(socket, 'fromEvent').mockReturnValue(event);
        chatService.getNotificationsAfterDelete().subscribe(data => {
            expect(data).toEqual(notififcationsData);
        });
        expect(socket.fromEvent).toHaveBeenCalledWith('allNotificationsAfterDelete');
    });

    it('Delete all notififcations with socket emit', () => {
        const recipientId = '64a7cbc9c8b6a84165a50c8f';
        const emit = jest.spyOn(socket, 'emit');
        chatService.clearAllNotifications(recipientId);
        expect(emit).toHaveBeenCalledWith('deleteAllNotifications', recipientId);
    });

    it('Get message error', () => {
        const message: string = 'Messages were not found.';
        const event = of(message);
        jest.spyOn(socket, 'fromEvent').mockReturnValue(event);
        chatService.getMessageError().subscribe(data => {
            expect(data).toEqual(message);
        });
        expect(socket.fromEvent).toHaveBeenCalledWith('messageError');
    });

    it('Get notification error', () => {
        const message: string = 'Notification not found';
        const event = of(message);
        jest.spyOn(socket, 'fromEvent').mockReturnValue(event);
        chatService.getNotificationError().subscribe(data => {
            expect(data).toEqual(message);
        });
        expect(socket.fromEvent).toHaveBeenCalledWith('notificationError');
    });

});