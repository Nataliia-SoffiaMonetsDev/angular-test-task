import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Signal, computed } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subject, first, takeUntil } from 'rxjs';
import { AuthGraphQlService } from 'src/app/_services/auth-service/auth-graphQl.service';
import { AuthService } from 'src/app/_services/auth-service/auth.service';
import { ChatService } from 'src/app/_services/chat-service/chat.service';
import { MessagesData, NotificationData, UserData } from 'src/app/shared/interfaces/data.interfaces';

@Component({
    standalone: true,
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class HeaderComponent implements OnInit, OnDestroy {

    public userData: Signal<UserData>;
    public messages: MessagesData[] = [];
    public error: string;
    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        public router: Router,
        private authService: AuthService,
        private chatService: ChatService,
        private authGraphService: AuthGraphQlService
    ) { }

    ngOnInit() {
        this.userData = computed(() => {
            return this.authService.isUserLoggedIn();
        });
        this.getNewMessage();
        this.getNotificationsAfterDelete();

        this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.getAllNotifications();
                if (this.router.url === '/chat') {
                    this.clearAllNotifications();
                }
            }
        });

        this.getError();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public logOut(): void {
        this.authGraphService.logout().pipe(first()).subscribe(() => {
            this.authService.isUserLoggedIn.set(null);
            this.authService.manageLocalStorage();
            this.router.navigate(['/login']);
        });
    }

    public deleteNotification(id: string): void {
        this.chatService.deleteNotification(this.userData()._id, id);
    }

    public stopClosing(event: MouseEvent): void {
        event.stopPropagation();
    }

    private getNewMessage(): void {
        this.chatService.getExternalUserMessage().pipe(takeUntil(this.destroy$)).subscribe((data: MessagesData) => {
            this.messages.push(data);
        });
    }

    private getAllNotifications(): void {
        this.chatService.requestAllNotifications();
        this.chatService.getAllNotifications().pipe(takeUntil(this.destroy$)).subscribe((data: NotificationData[]) => {
            if (this.userData()) {
                const notifications = data.filter(notification => this.userData()._id === notification.recipientId);
                if (notifications && notifications.length > 0) {
                    this.messages = notifications[0].messages;
                }
            }
        });
    }

    private getNotificationsAfterDelete(): void {
        this.chatService.getNotificationsAfterDelete().pipe(takeUntil(this.destroy$)).subscribe((data: NotificationData[]) => {
            const notifications = data.filter(notification => this.userData()._id === notification.recipientId);
            this.messages = notifications[0].messages;
        });
    }

    private clearAllNotifications(): void {
        this.chatService.clearAllNotifications(this.userData()._id);
    }

    private getError(): void {
        this.chatService.getNotificationError().pipe(takeUntil(this.destroy$)).subscribe((error: string) => {
            this.error = error;
        });
    }
}
