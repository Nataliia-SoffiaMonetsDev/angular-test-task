import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ChatService } from 'src/app/_services/chat.service';
import { TextareaInputComponent } from 'src/app/shared/inputs/textarea-input/textarea-input.component';
import { UserData } from 'src/app/shared/interfaces/data.interfaces';

@Component({
    standalone: true,
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextareaInputComponent,
    ],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {

    public newMessage$: Observable<string>;
    public messages: any[] = [];
    public form: FormGroup;
    public currentUser: UserData;
    private destroy$: Subject<void> = new Subject<void>();

    @ViewChild('chatBody') private chatBodyContainer: ElementRef;

    public get f() {
        return this.form.controls;
    }

    constructor(
        private formBuilder: FormBuilder,
        private chatService: ChatService,
        private datepipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('user'));
        this.form = this.formBuilder.group<any>({
            message: this.formBuilder.control(null, Validators.required)
        });

        this.chatService.getAllMessages().pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.messages = data;
        });
    }

    ngAfterViewInit(): void {
        this.chatService.getNewMessage().pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.messages.push(data);
            setTimeout(() => {
                this.scrollChatBody();
            }, 100);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public sendMessage(): void {
        const currentDateTime = this.datepipe.transform((new Date), 'd MMM h:mm a');
        const body = {
            userName: this.currentUser.userName,
            message: this.f['message'].value,
            date: currentDateTime
        }
        this.chatService.sendMessage(body);
        this.form.reset();
    }

    private scrollChatBody(): void {
        this.chatBodyContainer.nativeElement.scroll({
            top: this.chatBodyContainer.nativeElement.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }

}