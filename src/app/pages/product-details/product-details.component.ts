import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

    public product: any;
    public loading: boolean = false;
    private productId!: string;

    constructor(
        private producService: ProductService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.route.params.subscribe((params: any) => {
            this.productId = params['id'] ? params['id'] : null;
        });
        this.getProduct();
    }

    private getProduct(): void {
        this.producService.getProduct(this.productId).pipe(first()).subscribe(data => {
            this.product = data;
            this.loading = false;
        });
    }
}
