import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { ProductModalComponent } from '../../shared/product-modal/product-modal.component';
import { ProductService } from 'src/app/_services/product.service';
import { catchError, first, throwError } from 'rxjs';
import { ProductData } from 'src/app/shared/interfaces/data.interfaces';

@Component({
    selector: 'app-products-page',
    templateUrl: './products-page.component.html',
    styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {

    public products: ProductData[] = [];
    public loading = signal<boolean>(false);
    public error: string;

    @ViewChild('addProductModalComponent') addProductModalComponent: ProductModalComponent;

    constructor(
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        this.loading.set(true);
        this.getAllProducts();
    }

    public openProductModal(): void {
        this.addProductModalComponent.openModal();
    }

    public deleteProduct(id: string): void {
        this.productService.deleteProduct(id).pipe(
            first(),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe((data: ProductData[]) => {
            this.products = data;
            this.error = '';
        });
    }

    public addProduct(productInfo: ProductData): void {
        const body: ProductData = {
            name: productInfo.name,
            description: productInfo.description
        };
        this.productService.createProduct(body).pipe(
            first(),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe((data: ProductData) => {
            this.products.push(data);
            this.addProductModalComponent.hideModal();
            this.error = '';
        });
    }

    public onUpdateProducts(products: ProductData[]): void {
        this.products = products;
    }

    private getAllProducts(): void {
        this.productService.getAllProducts().pipe(
            first(),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe((data: ProductData[]) => {
            this.products = data;
            this.loading.set(false);
            this.error = '';
        });
    }
}
