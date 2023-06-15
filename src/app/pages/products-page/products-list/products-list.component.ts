import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
import { ProductService } from 'src/app/_services/product.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
    
    @Input() products: any[] = [];
    @Output() onProductDelete = new EventEmitter();
    @Output() onProductUpdate = new EventEmitter();
    @ViewChild('editProductModalComponent') editProductModalComponent!: AddProductModalComponent;

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
        const body = {
            name: product.productName,
            description: product.productDescription,
            _id: product.productId
        };
        this.producService.updateProduct(body).pipe(first()).subscribe(data => {
            this.onProductUpdate.emit(data);
        });
    }
}
