import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModalComponent } from '../../../shared/product-modal/product-modal.component';
import { ProductService } from 'src/app/_services/product.service';
import { catchError, first, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

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

    @Input() products: any[] = [];
    @Output() onProductDelete = new EventEmitter();
    @Output() onProductUpdate = new EventEmitter();
    @ViewChild('editProductModalComponent') editProductModalComponent!: ProductModalComponent;

    public error!: string;

    constructor(
        private router: Router,
        private producService: ProductService
    ) { }

    ngOnInit(): void {
    }

    public deleteProduct(id: number): void {
        this.onProductDelete.emit(id);
    }

    public navigateToProductDetails(id: number): void {
        this.router.navigate([`/product-details/${id}`]);
    }

    public openEditModal(product: any) {
        this.editProductModalComponent.openEditModal(product);
    }

    public editProduct(product: any) {
        const existingProduct = this.products.find((prod: any) => prod._id === product.productId);
        const isProductEdited = !(product.productName === existingProduct.name && product.productDescription === existingProduct.description);
        if (isProductEdited) {
            const body = {
                name: product.productName,
                description: product.productDescription,
                _id: product.productId
            };
            this.producService.updateProduct(body).pipe(
                first(),
                catchError(error => {
                    this.error = error.error;
                    return throwError(error);
                })
            ).subscribe(data => {
                this.onProductUpdate.emit(data);
            });
        }
    }
}
