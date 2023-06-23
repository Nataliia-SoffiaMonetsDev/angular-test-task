import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsPageRoutingModule } from './products-page-routing.module';
import { ProductsPageComponent } from './products-page.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductModalComponent } from '../../shared/product-modal/product-modal.component';
import { LoadingScreenComponent } from 'src/app/shared/loading-screen/loading-screen.component';

@NgModule({
    declarations: [
        ProductsPageComponent,
    ],
    imports: [
        CommonModule,
        ProductsPageRoutingModule,
        ProductsListComponent,
        ProductModalComponent,
        LoadingScreenComponent
    ]
})
export class ProductsPageModule { }