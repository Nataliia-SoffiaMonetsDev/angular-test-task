import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
    
    @Input() products: any[] = [];
    @Output() onProductDelete = new EventEmitter();
    @ViewChild('editProductModalComponent') editProductModalComponent!: AddProductModalComponent;

    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {
    }

    public deleteProduct(index: number): void {
        this.onProductDelete.emit(index);
    }

    public navigateToProductDetails(index: number): void {
        this.router.navigate([])
    }

    public editProduct(product: any) {
        this.editProductModalComponent.openModal();
    }
}
