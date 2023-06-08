import { Component, OnInit, ViewChild } from '@angular/core';
import { AddProductModalComponent } from './add-product-modal/add-product-modal.component';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {
    
    public products: any[] = [
        {
            name: 'Product 1',
            description: 'Some quick example text to build on the card title and make up the bulk of the cards content.',
            id: 1
        },
        {
            name: 'Product 2',
            description: 'Some quick example text to build on the card title and make up the bulk of the cards content.',
            id: 2
        },{
            name: 'Product 3',
            description: 'Some quick example text to build on the card title and make up the bulk of the cards content.',
            id: 3
        },{
            name: 'Product 4',
            description: 'Some quick example text to build on the card title and make up the bulk of the cards content.',
            id: 4
        },
    ];

    @ViewChild('addProductModalComponent') addProductModalComponent!: AddProductModalComponent;

    ngOnInit(): void {
    }

    public addProduct(): void {
        this.addProductModalComponent.openModal();
    }

    public deleteProduct(index: number): void {
        this.products.splice(index, 1);
    }
}
