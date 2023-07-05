import { Component, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, catchError, first, takeUntil, throwError } from 'rxjs';
import { ProductService } from 'src/app/_services/product.service';
import { ProductModalComponent } from '../../shared/product-modal/product-modal.component';
import { ProductData } from 'src/app/shared/interfaces/data.interfaces';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from 'src/app/shared/loading-screen/loading-screen.component';

@Component({
    standalone: true,
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss'],
    imports: [
        CommonModule,
        ProductModalComponent,
        LoadingScreenComponent,
        ConfirmModalComponent,
        RouterModule
    ]
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

    public product: ProductData;
    public loading = signal<boolean>(false);
    public error: string;
    private productId: string;

    private destroy$: Subject<void> = new Subject<void>();

    @ViewChild('editProductModalComponent') editProductModalComponent: ProductModalComponent;
    @ViewChild('confirmModalComponent') confirmModalComponent: ConfirmModalComponent;

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loading.set(true);
        this.route.params.subscribe((params: any) => {
            this.productId = params['id'] ? params['id'] : null;
        });
        this.getProduct();

        this.productService.getUpdatedProductWithSocket().pipe(
            takeUntil(this.destroy$),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe((data: ProductData[]) => {
            this.product = data.find((product: ProductData) => product._id === this.productId);
            this.editProductModalComponent.hideModal();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public openEditModal(product: ProductData) {
        this.editProductModalComponent.openEditModal(product);
    }

    public deleteProduct(): void {
        this.productService.deleteProductWithSocket(this.productId);
        this.router.navigate(['/products']);
        // this.productService.deleteProduct(this.productId).pipe(
        //     first(),
        //     catchError(error => {
        //         this.error = error;
        //         return throwError(error);
        //     })
        // ).subscribe(() => {
        //     this.router.navigate(['/products']);
        // });
    }

    public editProduct(product: ProductData) {
        this.error = '';
        const isProductEdited: boolean = !(product.name === this.product?.name && product.description === this.product?.description);
        if (isProductEdited) {
            this.productService.updateProductWithSocket(product);
            // this.productService.updateProduct(product).pipe(
            //     first(),
            //     catchError(error => {
            //         this.error = error;
            //         return throwError(error);
            //     })
            // ).subscribe((data: ProductData[]) => {
            //     this.product = data.find((product: ProductData) => product._id === this.productId);
            //     this.editProductModalComponent.hideModal();
            // });
        } else {
            this.editProductModalComponent.hideModal();
        }
    }

    private getProduct(): void {
        this.error = '';
        this.productService.getProduct(this.productId).pipe(
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
