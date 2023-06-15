import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { ProductService } from 'src/app/_services/product.service';
import { AddProductModalComponent } from '../products-page/add-product-modal/add-product-modal.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

    public product: any;
    public loading: boolean = false;
    private productId!: string;

    @ViewChild('editProductModalComponent') editProductModalComponent!: AddProductModalComponent;

    constructor(
        private producService: ProductService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.route.params.subscribe((params: any) => {
            this.productId = params['id'] ? params['id'] : null;
        });
        this.getProduct();
    }

    public openEditModal(product: any) {
        this.editProductModalComponent.openEditModal(product);
    }

    public deleteProduct(id: string): void {
        this.producService.deleteProduct(id).pipe(first()).subscribe(data => {
            this.router.navigate(['/products']);
        });
    }

    public editProduct(product: any) {
        const body = {
            name: product.productName,
            description: product.productDescription,
            _id: product.productId
        };
        this.producService.updateProduct(body).pipe(first()).subscribe(data => {
            this.product = data.find((product: any) => product._id === this.productId);
        });
    }

    private getProduct(): void {
        this.producService.getProduct(this.productId).pipe(first()).subscribe(data => {
            this.product = data;
            this.loading = false;
        });
    }
}
