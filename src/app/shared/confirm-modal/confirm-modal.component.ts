import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    standalone: true,
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss'],
    imports: [
        CommonModule
    ],
    providers: [BsModalService]
})
export class ConfirmModalComponent {

    public modalRef: BsModalRef;
    @ViewChild('template') elementRef: TemplateRef<Element>;
    @Output() onConfirm = new EventEmitter();

    constructor(
        private modalService: BsModalService
    ) { }

    public openModal(): void {
        this.modalRef = this.modalService.show(this.elementRef);
    }

    public hideModal(): void {
        if (this.modalRef) {
            this.modalRef.hide();
        }
    }

    public confirmAction(): void {
        this.onConfirm.emit();
        this.hideModal();
    }
}
