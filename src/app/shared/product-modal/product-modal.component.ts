import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TextInputComponent } from 'src/app/shared/inputs/text-input/text-input.component';
import { TextareaInputComponent } from 'src/app/shared/inputs/textarea-input/textarea-input.component';
import { ProductForm } from '../interfaces/forms.interfaces';
import { ProductData } from '../interfaces/data.interfaces';

@Component({
    standalone: true,
    selector: 'app-product-modal',
    templateUrl: './product-modal.component.html',
    styleUrls: ['./product-modal.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextInputComponent,
        TextareaInputComponent,
    ],
    providers: [BsModalService]
})
export class ProductModalComponent implements OnInit {

    public modalRef: BsModalRef;
    public form: FormGroup;
    public submitted: boolean = false;
    @Input() isEditMode: boolean = false;
    @Input() error: string;
    @ViewChild('template') elementRef: TemplateRef<Element>;
    @Output() onAddProduct = new EventEmitter();
    @Output() onEditProduct = new EventEmitter();

    public get f() {
        return this.form.controls;
    }

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group<ProductForm>({
            productName: this.formBuilder.control(null, { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(40)] }),
            productDescription: this.formBuilder.control(null, { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(300)] }),
            productId: this.formBuilder.control(null),
        });
    }

    public openModal(): void {
        this.modalRef = this.modalService.show(this.elementRef);
    }

    public openEditModal(productDeatils: ProductData): void {
        this.f['productName'].setValue(productDeatils.name);
        this.f['productDescription'].setValue(productDeatils.description);
        this.f['productId'].setValue(productDeatils._id);
        this.openModal();
    }

    public hideModal(): void {
        if (this.modalRef) {
            this.modalRef.hide();
        }
        this.form.reset();
        this.submitted = false;
        this.error = '';
    }

    public addProduct(): void {
        if (!this.form.valid) {
            this.submitted = true;
            return;
        }
        this.onAddProduct.emit(this.getFormValue());
    }

    public editProduct(): void {
        if (!this.form.valid) {
            this.submitted = true;
            return;
        }
        this.onEditProduct.emit(this.getFormValue());
    }

    public getFormValue(): ProductData {
        const product: ProductData = {
            name: this.f['productName'].value,
            description: this.f['productDescription'].value,
            _id: this.f['productId'].value
        };
        return product;
    }

}
