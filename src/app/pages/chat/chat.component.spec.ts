import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Socket, SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { MessagesData } from 'src/app/shared/interfaces/data.interfaces';
import { of } from 'rxjs';
import { ChatService } from 'src/app/_services/chat-service/chat.service';
import { ChatComponent } from './chat.component';
import { DatePipe } from '@angular/common';

const config: SocketIoConfig = { url: environment.apiUrl, options: {} }

describe('ChatComponent', () => {
    let component: ChatComponent;
    let fixture: ComponentFixture<ChatComponent>;
    let chatService: ChatService;
    let socket: Socket;
    let datePipe: DatePipe;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChatComponent, HttpClientTestingModule, RouterTestingModule, SocketIoModule.forRoot(config)],
            providers: [ChatService, DatePipe]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatComponent);
        component = fixture.componentInstance;
        chatService = TestBed.inject(ChatService);
        socket = TestBed.inject(Socket);
        datePipe = TestBed.inject(DatePipe);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('Component successfully created', () => {
        expect(component).toBeTruthy();
    });

    it('Component initial state', () => {
        expect(component.messages).toEqual([]);
        expect(component.error).toBeUndefined();
        expect(component.currentUser).toEqual(null);
        expect(component.form).toBeDefined();
    });

    it('Send message', () => {
        const messageData: MessagesData = {
            date: datePipe.transform((new Date), 'd MMM h:mm a'),
            message: 'message',
            userName: 'Name',
        };
        component.currentUser = {
            "_id": "64a42b84ba332ad08a38045d",
            "email": "email@mail.com",
            "userName": "Name",
            "password": "$2b$05$5Ag5rjcSGMsy0zy6OZ1pBezJ5Ssm7/O6Y7ZfgcqOD4VwXfVhsDz36",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTQyYjg0YmEzMzJhZDA4YTM4MDQ1ZCIsImVtYWlsIjoibmF0YUBtYWlsLmNvbSIsImlhdCI6MTY4OTMyMTg3OSwiZXhwIjoxNjg5MzY1MDc5fQ.z9JDjCLeQzu-i638kgzUv7Dnx5fKKItzZjmKnlYzRfk"
        };
        component.form.controls['message'].setValue(messageData.message);
        expect(component.form.value).toEqual({ message: messageData.message });
        jest.spyOn(chatService, 'sendMessage');
        component.sendMessage();
        expect(component.form.value).toEqual({ message: null });
        expect(chatService.sendMessage).toHaveBeenCalledWith(messageData);
    });

    it('Scroll to the bottom of the chat', () => {
        const scroll = jest.fn();
        const chatBodyContainer = {
            nativeElement: {
                scroll: scroll,
                scrollHeight: 100
            }
        };
        component.chatBodyContainer = chatBodyContainer;
        component['scrollChatBody']();
        setTimeout(() => {
            expect(scroll).toHaveBeenCalledWith({
                top: chatBodyContainer.nativeElement.scrollHeight,
                left: 0,
                behavior: 'smooth'
            });
        }, 100);
    });

    it('Get all messages', () => {
        const messagesData: MessagesData[] = [
            {
                date: '7 Jul 3:11 PM',
                message: 'message',
                userName: 'Name',
            },
            {
                date: '8 Jul 3:11 PM',
                message: 'message1',
                userName: 'Name1',
            }
        ]
        jest.spyOn(chatService, 'getAllMessages').mockReturnValue(of(messagesData));
        component['getAllMessages']();
        expect(chatService.getAllMessages).toHaveBeenCalled();
        expect(component.messages).toEqual(messagesData);
    });

    it('Get new message', () => {
        const messageData: MessagesData = {
            date: '7 Jul 3:11 PM',
            message: 'message',
            userName: 'Name',
        }
        jest.spyOn(chatService, 'getNewMessage').mockReturnValue(of(messageData));
        component['getNewMessages']();
        expect(chatService.getNewMessage).toHaveBeenCalled();
        expect(component.messages).toContain(messageData);
    });

    it('Get message error', () => {
        const messageError: string = 'Messages were not found.';
        jest.spyOn(chatService, 'getMessageError').mockReturnValue(of(messageError));
        component['getError']();
        expect(chatService.getMessageError).toHaveBeenCalled();
        expect(component.error).toEqual(messageError);
    });

    describe('The form validity', () => {
        const testCases = [
            {
                fieldName: 'message',
                fieldValue: "",
                error: 'required'
            },
            {
                fieldName: 'message',
                fieldValue: "Hello",
                error: ''
            },
        ];

        testCases.forEach(testCase => {
            it(`Field ${testCase.fieldName} validity`, () => {
                component.form.controls[testCase.fieldName].setValue(testCase.fieldValue);
                if (testCase.error) {
                    expect(component.form.get(testCase.fieldName).errors[testCase.error]).toBeTruthy();
                    expect(component.form.invalid).toBeTruthy();
                } else {
                    expect(component.form.get(testCase.fieldName).errors).toBeFalsy();
                    expect(component.form.invalid).toBeFalsy();
                }
            });
        });
    });

});
