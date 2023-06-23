import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsRoutingModule } from './product-details-routing.module';
import { ProductDetailsComponent } from './product-details.component';
import { LoadingScreenComponent } from 'src/app/shared/loading-screen/loading-screen.component';
import { ProductModalComponent } from '../../shared/product-modal/product-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';

@NgModule({
    declarations: [
        ProductDetailsComponent,
    ],
    imports: [
        CommonModule,
        ProductDetailsRoutingModule,
        ProductModalComponent,
        LoadingScreenComponent,
        ConfirmModalComponent
    ]
})
export class ProductDetailsModule { }