import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-add-product-modal',
    templateUrl: './add-product-modal.component.html',
    styleUrls: ['./add-product-modal.component.scss']
})
export class AddProductModalComponent implements OnInit {

    public modalRef!: BsModalRef;
    @ViewChild('template') elementRef!: TemplateRef<any>;
    @Output() onAddProduct = new EventEmitter();

    constructor(
        private modalService: BsModalService
    ) { }

    ngOnInit(): void {
    }

    public openModal(): void {
        this.modalRef = this.modalService.show(this.elementRef);
    }

    public hideModal(): void {
        if (this.modalRef) {
            this.modalRef.hide();
        }
    }

    public addProduct(): void {
        this.onAddProduct.emit();
        this.modalRef.hide();
    }

}
