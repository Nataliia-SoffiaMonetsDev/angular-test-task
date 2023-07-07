import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Signal, computed } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, first, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';
import { ChatService } from 'src/app/_services/chat.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MessagesData, NotificationData, UserData } from 'src/app/shared/interfaces/data.interfaces';

@Component({
    standalone: true,
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        CommonModule,
        AppRoutingModule
    ]
})
export class HeaderComponent implements OnInit, OnDestroy {

    public userData: Signal<UserData>;
    public messages: MessagesData[] = [];
    private destroy$: Subject<void> = new Subject<void>();
    private recipientId: string;

    constructor(
        public router: Router,
        private authService: AuthService,
        private chatService: ChatService,
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
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public logOut(): void {
        this.authService.logout().pipe(first()).subscribe(() => {
            this.authService.isUserLoggedIn.set(null);
            this.authService.manageLocalStorage();
            this.router.navigate(['/login']);
        });
    }

    public deleteNotification(id: string): void {
        this.chatService.deleteNotification(this.recipientId, id);
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
                this.recipientId = notifications[0]._id;
                this.messages = notifications[0].messages;
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
        this.chatService.clearAllNotifications(this.recipientId);
    }
}
