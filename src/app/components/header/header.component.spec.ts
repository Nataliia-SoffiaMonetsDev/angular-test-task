import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Socket, SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ChatService } from 'src/app/_services/chat-service/chat.service';
import { HeaderComponent } from './header.component';
import { AuthService } from 'src/app/_services/auth-service/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MessagesData, NotificationData } from 'src/app/shared/interfaces/data.interfaces';
import { of } from 'rxjs';
import { computed } from '@angular/core';
import { NavigationEnd } from '@angular/router';

const config: SocketIoConfig = { url: environment.apiUrl, options: {} }

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let authService: AuthService;
    let chatService: ChatService;
    let socket: Socket;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderComponent, HttpClientTestingModule, RouterTestingModule, SocketIoModule.forRoot(config)],
            providers: [AuthService, ChatService]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService);
        chatService = TestBed.inject(ChatService);
        socket = TestBed.inject(Socket);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('Component successfully created', () => {
        expect(component).toBeTruthy();
    });

    it('Component initial state', () => {
        expect(component.userData).toBeDefined();
        expect(component.messages).toEqual([]);
        expect(component.error).toBeUndefined();
    });

    it('ngOnInit', () => {
        const userData = {
            "_id": "64a42b84ba332ad08a38045d",
            "email": "email@mail.com",
            "userName": "Name",
            "password": "$2b$05$5Ag5rjcSGMsy0zy6OZ1pBezJ5Ssm7/O6Y7ZfgcqOD4VwXfVhsDz36",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTQyYjg0YmEzMzJhZDA4YTM4MDQ1ZCIsImVtYWlsIjoibmF0YUBtYWlsLmNvbSIsImlhdCI6MTY4OTMyNDEzOSwiZXhwIjoxNjg5MzY3MzM5fQ.zjfaUChp9wXh3J_fDdGbVyyjkTRyKwqtl6dxsO9q80c"
        };
        const navigationEnd = new NavigationEnd(0, '/chat', '/chat');
        jest.spyOn(authService, 'isUserLoggedIn').mockReturnValue(userData);
        jest.spyOn(component as any, 'getNewMessage');
        jest.spyOn(component as any, 'getNotificationsAfterDelete');
        jest.spyOn(component['router'].events, 'pipe').mockReturnValue(of(navigationEnd));
        jest.spyOn(component as any, 'getAllNotifications');
        jest.spyOn(component as any, 'clearAllNotifications');
        jest.spyOn(component as any, 'getError');
        component.ngOnInit();
        setTimeout(() => {
            expect(component.userData()).toBe(userData);
            expect(component['getNewMessage']).toHaveBeenCalled();
            expect(component['getNotificationsAfterDelete']).toHaveBeenCalled();
            expect(component['router'].events.pipe).toHaveBeenCalled();
            expect(component['getAllNotifications']).toHaveBeenCalled();
            expect(component['clearAllNotifications']).toHaveBeenCalled();
            expect(component['getError']).toHaveBeenCalled();
            expect(authService.isUserLoggedIn).toHaveBeenCalled();
        }, 1000);
    });

    it('Logout', () => {
        component.userData = component.userData = computed(() => {
            return {
                "_id": "64a42b84ba332ad08a38045d",
                "email": "email@mail.com",
                "userName": "Name",
                "password": "$2b$05$5Ag5rjcSGMsy0zy6OZ1pBezJ5Ssm7/O6Y7ZfgcqOD4VwXfVhsDz36",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTQyYjg0YmEzMzJhZDA4YTM4MDQ1ZCIsImVtYWlsIjoibmF0YUBtYWlsLmNvbSIsImlhdCI6MTY4OTMyNDEzOSwiZXhwIjoxNjg5MzY3MzM5fQ.zjfaUChp9wXh3J_fDdGbVyyjkTRyKwqtl6dxsO9q80c"
            };
        });
        jest.spyOn(authService, 'logout').mockReturnValue(of(null));
        jest.spyOn(component['router'], 'navigate');
        component.logOut();
        expect(authService.logout).toHaveBeenCalled();
        expect(component['router'].navigate).toHaveBeenCalledWith(['/login']);
    });

    it('Delete a notification', () => {
        const notificationId = '64abcdee4ec1b2bc7dd0ed55';
        component.userData = computed(() => {
            return {
                "_id": "64a42b84ba332ad08a38045d",
                "email": "email@mail.com",
                "userName": "Name",
                "password": "$2b$05$5Ag5rjcSGMsy0zy6OZ1pBezJ5Ssm7/O6Y7ZfgcqOD4VwXfVhsDz36",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTQyYjg0YmEzMzJhZDA4YTM4MDQ1ZCIsImVtYWlsIjoibmF0YUBtYWlsLmNvbSIsImlhdCI6MTY4OTMyNDEzOSwiZXhwIjoxNjg5MzY3MzM5fQ.zjfaUChp9wXh3J_fDdGbVyyjkTRyKwqtl6dxsO9q80c"
            };
        });
        jest.spyOn(chatService, 'deleteNotification');
        component.deleteNotification(notificationId);
        expect(chatService.deleteNotification).toHaveBeenCalledWith(component.userData()._id, notificationId);
    });

    it('Stop event propagation', () => {
        const clickEvent = {
            stopPropagation: jest.fn()
        } as unknown as MouseEvent;
        component.stopClosing(clickEvent);
        expect(clickEvent.stopPropagation).toHaveBeenCalled();
    });

    it('Get new message', () => {
        const messageData: MessagesData = {
            date: '7 Jul 3:11 PM',
            message: 'message',
            userName: 'Name',
        }
        jest.spyOn(chatService, 'getExternalUserMessage').mockReturnValue(of(messageData));
        component['getNewMessage']();
        expect(chatService.getExternalUserMessage).toHaveBeenCalled();
        expect(component.messages).toContain(messageData);
    });

    it('Get all notifications', () => {
        const notififcationsData: NotificationData[] = [
            {
                recipientId: '64a42b84ba332ad08a38045d',
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
        component.userData = computed(() => {
            return {
                "_id": "64a42b84ba332ad08a38045d",
                "email": "email@mail.com",
                "userName": "Name",
                "password": "$2b$05$5Ag5rjcSGMsy0zy6OZ1pBezJ5Ssm7/O6Y7ZfgcqOD4VwXfVhsDz36",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTQyYjg0YmEzMzJhZDA4YTM4MDQ1ZCIsImVtYWlsIjoibmF0YUBtYWlsLmNvbSIsImlhdCI6MTY4OTMyNDEzOSwiZXhwIjoxNjg5MzY3MzM5fQ.zjfaUChp9wXh3J_fDdGbVyyjkTRyKwqtl6dxsO9q80c"
            };
        });
        jest.spyOn(chatService, 'requestAllNotifications');
        jest.spyOn(chatService, 'getAllNotifications').mockReturnValue(of(notififcationsData));
        component['getAllNotifications']();
        expect(chatService.requestAllNotifications).toHaveBeenCalled();
        expect(chatService.getAllNotifications).toHaveBeenCalled();
        expect(component.messages).toEqual(notififcationsData[0].messages);
    });

    it('Get notifications after delete', () => {
        const notififcationsData: NotificationData[] = [
            {
                recipientId: '64a42b84ba332ad08a38045d',
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
        component.userData = computed(() => {
            return {
                "_id": "64a42b84ba332ad08a38045d",
                "email": "email@mail.com",
                "userName": "Name",
                "password": "$2b$05$5Ag5rjcSGMsy0zy6OZ1pBezJ5Ssm7/O6Y7ZfgcqOD4VwXfVhsDz36",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTQyYjg0YmEzMzJhZDA4YTM4MDQ1ZCIsImVtYWlsIjoibmF0YUBtYWlsLmNvbSIsImlhdCI6MTY4OTMyNDEzOSwiZXhwIjoxNjg5MzY3MzM5fQ.zjfaUChp9wXh3J_fDdGbVyyjkTRyKwqtl6dxsO9q80c"
            };
        });
        jest.spyOn(chatService, 'getNotificationsAfterDelete').mockReturnValue(of(notififcationsData));
        component['getNotificationsAfterDelete']();
        expect(chatService.getNotificationsAfterDelete).toHaveBeenCalled();
        expect(component.messages).toEqual(notififcationsData[0].messages);
    });

    it('Clear all notifications', () => {
        component.userData = computed(() => {
            return {
                "_id": "64a42b84ba332ad08a38045d",
                "email": "email@mail.com",
                "userName": "Name",
                "password": "$2b$05$5Ag5rjcSGMsy0zy6OZ1pBezJ5Ssm7/O6Y7ZfgcqOD4VwXfVhsDz36",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTQyYjg0YmEzMzJhZDA4YTM4MDQ1ZCIsImVtYWlsIjoibmF0YUBtYWlsLmNvbSIsImlhdCI6MTY4OTMyNDEzOSwiZXhwIjoxNjg5MzY3MzM5fQ.zjfaUChp9wXh3J_fDdGbVyyjkTRyKwqtl6dxsO9q80c"
            };
        });
        jest.spyOn(chatService, 'clearAllNotifications');
        component['clearAllNotifications']();
        expect(chatService.clearAllNotifications).toHaveBeenCalledWith(component.userData()._id);
    });

    it('Get notification error', () => {
        const notificationError: string = 'Notification were not found';
        jest.spyOn(chatService, 'getNotificationError').mockReturnValue(of(notificationError));
        component['getError']();
        expect(chatService.getNotificationError).toHaveBeenCalled();
        expect(component.error).toEqual(notificationError);
    });

});
