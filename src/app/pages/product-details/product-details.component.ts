import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, first, throwError } from 'rxjs';
import { ProductService } from 'src/app/_services/product.service';
import { ProductModalComponent } from '../../shared/product-modal/product-modal.component';
import { ProductData } from 'src/app/shared/interfaces/data.interfaces';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

    public product: ProductData;
    public loading = signal<boolean>(false);
    public error: string;
    private productId: string;

    @ViewChild('editProductModalComponent') editProductModalComponent: ProductModalComponent;
    @ViewChild('confirmModalComponent') confirmModalComponent: ConfirmModalComponent;

    constructor(
        private producService: ProductService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loading.set(true);
        this.route.params.subscribe((params: any) => {
            this.productId = params['id'] ? params['id'] : null;
        });
        this.getProduct();
    }

    public openEditModal(product: ProductData) {
        this.editProductModalComponent.openEditModal(product);
    }

    public deleteProduct(): void {
        this.producService.deleteProduct(this.productId).pipe(
            first(),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe(() => {
            this.router.navigate(['/products']);
        });
    }

    public editProduct(product: ProductData) {
        this.error = '';
        const isProductEdited: boolean = !(product.name === this.product?.name && product.description === this.product?.description);
        if (isProductEdited) {
            this.producService.updateProduct(product).pipe(
                first(),
                catchError(error => {
                    this.error = error;
                    return throwError(error);
                })
            ).subscribe((data: ProductData[]) => {
                this.product = data.find((product: ProductData) => product._id === this.productId);
                this.editProductModalComponent.hideModal();
            });
        } else {
            this.editProductModalComponent.hideModal();
        }
    }

    private getProduct(): void {
        this.error = '';
        this.producService.getProduct(this.productId).pipe(
            first(),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe((data: ProductData) => {
            this.product = data;
            this.loading.set(false);
        });
    }
}
