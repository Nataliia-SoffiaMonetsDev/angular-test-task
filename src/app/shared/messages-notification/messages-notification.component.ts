import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessagesData } from '../interfaces/data.interfaces';

@Component({
    standalone: true,
    selector: 'app-messages-notification',
    templateUrl: './messages-notification.component.html',
    styleUrls: ['./messages-notification.component.scss'],
    imports: [
        CommonModule
    ]
})
export class MessagesNotificationComponent {

    @Input() showMessage: boolean = false;
    @Input() messageData: MessagesData;

}
