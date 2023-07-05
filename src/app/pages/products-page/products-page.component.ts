import { Component, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { ProductModalComponent } from '../../shared/product-modal/product-modal.component';
import { ProductService } from 'src/app/_services/product.service';
import { Subject, catchError, first, takeUntil, throwError } from 'rxjs';
import { ProductData } from 'src/app/shared/interfaces/data.interfaces';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list/products-list.component';
import { LoadingScreenComponent } from 'src/app/shared/loading-screen/loading-screen.component';

@Component({
    standalone: true,
    selector: 'app-products-page',
    templateUrl: './products-page.component.html',
    styleUrls: ['./products-page.component.scss'],
    imports: [
        CommonModule,
        ProductsListComponent,
        ProductModalComponent,
        LoadingScreenComponent
    ]
})
export class ProductsPageComponent implements OnInit, OnDestroy {

    public products: ProductData[] = [];
    public loading = signal<boolean>(false);
    public error: string;
    private destroy$: Subject<void> = new Subject<void>();

    @ViewChild('addProductModalComponent') addProductModalComponent: ProductModalComponent;

    constructor(
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        this.loading.set(true);
        this.getAllProducts();

        this.productService.getNewProductWithSocket().pipe(
            takeUntil(this.destroy$),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe((data: ProductData) => {
            this.products.push(data);
            this.addProductModalComponent.hideModal();
        });

        this.productService.getProductAfterDeleteWithSocket().pipe(
            takeUntil(this.destroy$),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe((data: ProductData[]) => {
            this.products = data;
            this.error = '';
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public openProductModal(): void {
        this.addProductModalComponent.openModal();
    }

    public deleteProduct(id: string): void {
        // this.productService.deleteProduct(id).pipe(
        //     first(),
        //     catchError(error => {
        //         this.error = error;
        //         return throwError(error);
        //     })
        // ).subscribe((data: ProductData[]) => {
        //     this.products = data;
        //     this.error = '';
        // });
        this.productService.deleteProductWithSocket(id);
    }

    public addProduct(productInfo: ProductData): void {
        this.error = '';
        const body: ProductData = {
            name: productInfo.name,
            description: productInfo.description
        };
        // this.productService.createProduct(body).pipe(
        //     first(),
        //     catchError(error => {
        //         this.error = error;
        //         return throwError(error);
        //     })
        // ).subscribe((data: ProductData) => {
        //     this.products.push(data);
        //     this.addProductModalComponent.hideModal();
        // });
        this.productService.createProductWithSocket(body);
    }

    public onUpdateProducts(products: ProductData[]): void {
        this.products = products;
    }

    private getAllProducts(): void {
        this.error = '';
        this.productService.getAllProducts().pipe(
            first(),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe((data: ProductData[]) => {
            this.products = data;
            this.loading.set(false);
        });
    }
}
