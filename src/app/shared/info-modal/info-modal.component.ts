import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    standalone: true,
    selector: 'app-info-modal',
    templateUrl: './info-modal.component.html',
    styleUrls: ['./info-modal.component.scss'],
    imports: [
        CommonModule
    ],
    providers: [BsModalService]
})
export class InfoModalComponent {

    public modalRef: BsModalRef;
    @Input() modalText: string;
    @ViewChild('template') elementRef: TemplateRef<Element>;

    constructor(
        private modalService: BsModalService
    ) { }

    public openModal(): void {
        this.modalRef = this.modalService.show(this.elementRef);
        setTimeout(() => {
            this.hideModal();
        }, 2000);
    }

    public hideModal(): void {
        if (this.modalRef) {
            this.modalRef.hide();
        }
    }

}
