import { Component, OnInit, ViewChild } from '@angular/core';
import { AddProductModalComponent } from './add-product-modal/add-product-modal.component';
import { ProductService } from 'src/app/_services/product.service';
import { first } from 'rxjs';

@Component({
    selector: 'app-products-page',
    templateUrl: './products-page.component.html',
    styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {

    public products: any[] = [];
    public loading: boolean = false;

    @ViewChild('addProductModalComponent') addProductModalComponent!: AddProductModalComponent;

    constructor(
        private producService: ProductService
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.getAllProducts();
    }

    public openProductModal(): void {
        this.addProductModalComponent.openModal();
    }

    public deleteProduct(id: string): void {
        this.producService.deleteProduct(id).pipe(first()).subscribe(data => {
            this.products = data;
        });
    }

    public addProduct(productInfo: any): void {
        const body = {
            name: productInfo.productName,
            description: productInfo.productDescription
        };
        this.producService.createProduct(body).pipe(first()).subscribe(data => {
            this.products.push(data);
        });
    }

    public onUpdateProducts(products: any): void {
        this.products = products;
    }

    private getAllProducts(): void {
        this.producService.getAllProducts().pipe(first()).subscribe(data => {
            this.products = data;
            this.loading = false;
        });
    }
}
