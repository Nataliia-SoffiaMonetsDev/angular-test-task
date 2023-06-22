import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModalComponent } from '../../../shared/product-modal/product-modal.component';
import { ProductService } from 'src/app/_services/product.service';
import { catchError, first, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductData } from 'src/app/shared/interfaces/data.interfaces';

@Component({
    standalone: true,
    selector: 'app-products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss'],
    imports: [
        CommonModule,
        ProductModalComponent
    ]
})
export class ProductsListComponent implements OnInit {

    @Input() products: ProductData[] = [];
    @Output() onProductDelete = new EventEmitter();
    @Output() onProductUpdate = new EventEmitter();
    @ViewChild('editProductModalComponent') editProductModalComponent: ProductModalComponent;

    public error: string;

    constructor(
        private router: Router,
        private producService: ProductService
    ) { }

    ngOnInit(): void {
    }

    public deleteProduct(id: string): void {
        this.onProductDelete.emit(id);
    }

    public navigateToProductDetails(id: string): void {
        this.router.navigate([`/product-details/${id}`]);
    }

    public openEditModal(product: ProductData) {
        this.editProductModalComponent.openEditModal(product);
    }

    public editProduct(product: ProductData) {
        const existingProduct: ProductData = this.products.find((prod: any) => prod._id === product._id);
        const isProductEdited: boolean = !(product.name === existingProduct.name && product.description === existingProduct.description);
        if (isProductEdited) {
            this.producService.updateProduct(product).pipe(
                first(),
                catchError(e => {
                    this.error = e.error.message;
                    return throwError(e);
                })
            ).subscribe((data: ProductData[]) => {
                this.onProductUpdate.emit(data);
                this.editProductModalComponent.hideModal();
            });
        }
    }
}
