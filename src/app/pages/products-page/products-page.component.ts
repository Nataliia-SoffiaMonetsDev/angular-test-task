import { Component, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { ProductModalComponent } from '../../shared/product-modal/product-modal.component';
import { ProductService } from 'src/app/_services/product-service/product.service';
import { Subject, catchError, first, takeUntil, throwError } from 'rxjs';
import { MessagesData, ProductData } from 'src/app/shared/interfaces/data.interfaces';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list/products-list.component';
import { LoadingScreenComponent } from 'src/app/shared/loading-screen/loading-screen.component';
import { InfoModalComponent } from 'src/app/shared/info-modal/info-modal.component';
import { MessagesNotificationComponent } from 'src/app/shared/messages-notification/messages-notification.component';
import { ChatService } from 'src/app/_services/chat.service';

@Component({
    standalone: true,
    selector: 'app-products-page',
    templateUrl: './products-page.component.html',
    styleUrls: ['./products-page.component.scss'],
    imports: [
        CommonModule,
        ProductsListComponent,
        ProductModalComponent,
        LoadingScreenComponent,
        InfoModalComponent,
        MessagesNotificationComponent
    ]
})
export class ProductsPageComponent implements OnInit, OnDestroy {

    public products: ProductData[] = [];
    public loading = signal<boolean>(false);
    public error: string;
    public modalInfoText: string;
    public showMessage: boolean = false;
    public currentMessage: MessagesData;
    private destroy$: Subject<void> = new Subject<void>();

    @ViewChild('addProductModalComponent') addProductModalComponent: ProductModalComponent;
    @ViewChild('productInfoModal') productInfoModal: InfoModalComponent;

    constructor(
        private productService: ProductService,
        private chatService: ChatService,
    ) { }

    ngOnInit(): void {
        this.loading.set(true);
        this.getAllProducts();
        this.getNewProductWithSocket();
        this.getProductAfterDeleteWithSocket();
        this.getUpdatedProductWithSocket();
        this.getNewMessage();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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
        ).subscribe(() => {
            this.error = '';
        });
    }

    public addProduct(productInfo: ProductData): void {
        this.error = '';
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
        ).subscribe(() => {
            this.addProductModalComponent.hideModal();
        });
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

    private getNewProductWithSocket(): void {
        this.productService.getNewProductWithSocket().pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: ProductData) => {
            this.modalInfoText = `Product '${data.name}' has been added.`;
            this.products.push(data);
            this.productInfoModal.openModal();
        });
    }

    private getProductAfterDeleteWithSocket(): void {
        this.productService.getProductAfterDeleteWithSocket().pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: [ProductData[], {deletedProductName: string}]) => {
            this.modalInfoText = `Product '${data[1].deletedProductName}' has been deleted.`;
            this.products = data[0];
            this.productInfoModal.openModal();
        });
    }

    private getUpdatedProductWithSocket(): void {
        this.productService.getUpdatedProductWithSocket().pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: [ProductData[], {updatedProductId: string}]) => {
            const product = data[0].find((prod: ProductData) => prod._id === data[1].updatedProductId);
            this.products = data[0];
            this.modalInfoText = `Product '${product.name}' has been updated.`;
            this.productInfoModal.openModal();
        });
    }

    private getNewMessage(): void {
        this.chatService.getExternalUserMessage().pipe(takeUntil(this.destroy$)).subscribe((data: MessagesData) => {
            this.currentMessage = data;
            this.showMessage = true;
            setTimeout(() => {
                this.showMessage = false;
            }, 2000);
        });
    }
}
