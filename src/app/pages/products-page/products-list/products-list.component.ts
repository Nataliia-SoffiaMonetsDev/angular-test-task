import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModalComponent } from '../../../shared/product-modal/product-modal.component';
import { ProductService } from 'src/app/_services/product.service';
import { Subject, catchError, first, takeUntil, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductData } from 'src/app/shared/interfaces/data.interfaces';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';

@Component({
    standalone: true,
    selector: 'app-products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss'],
    imports: [
        CommonModule,
        ProductModalComponent,
        ConfirmModalComponent
    ]
})
export class ProductsListComponent implements OnInit, OnDestroy {

    @Input() products: ProductData[] = [];
    @Output() onProductDelete = new EventEmitter();
    @Output() onProductUpdate = new EventEmitter();
    @ViewChild('editProductModalComponent') editProductModalComponent: ProductModalComponent;
    @ViewChild('confirmModalComponent') confirmModalComponent: ConfirmModalComponent;

    public error: string;
    public productId: string;

    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private router: Router,
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        this.productService.getUpdatedProductWithSocket().pipe(
            takeUntil(this.destroy$),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe((data: ProductData[]) => {
            this.onProductUpdate.emit(data);
            this.editProductModalComponent.hideModal();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public deleteProduct(id: string): void {
        this.productId = id;
        this.confirmModalComponent.openModal();
    }

    public onConfirmProductDelete(): void {
        this.onProductDelete.emit(this.productId);
    }

    public navigateToProductDetails(id: string): void {
        this.router.navigate([`/product-details/${id}`]);
    }

    public openEditModal(product: ProductData) {
        this.editProductModalComponent.openEditModal(product);
    }

    public editProduct(product: ProductData) {
        const existingProduct: ProductData = this.products.find((prod: ProductData) => prod._id === product._id);
        const isProductEdited: boolean = !(product.name === existingProduct.name && product.description === existingProduct.description);
        if (isProductEdited) {
            this.productService.updateProductWithSocket(product);
            // this.productService.updateProduct(product).pipe(
            //     first(),
            //     catchError(error => {
            //         this.error = error;
            //         return throwError(error);
            //     })
            // ).subscribe((data: ProductData[]) => {
            //     this.onProductUpdate.emit(data);
            //     this.editProductModalComponent.hideModal();
            // });
        } else {
            this.editProductModalComponent.hideModal();
        }
    }
}
