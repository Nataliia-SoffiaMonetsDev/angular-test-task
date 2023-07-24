import { Component, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, catchError, first, takeUntil, throwError } from 'rxjs';
import { ProductService } from 'src/app/_services/product-service/product.service';
import { ProductModalComponent } from '../../shared/product-modal/product-modal.component';
import { MessagesData, ProductData } from 'src/app/shared/interfaces/data.interfaces';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from 'src/app/shared/loading-screen/loading-screen.component';
import { InfoModalComponent } from 'src/app/shared/info-modal/info-modal.component';
import { MessagesNotificationComponent } from 'src/app/shared/messages-notification/messages-notification.component';
import { ChatService } from 'src/app/_services/chat-service/chat.service';
import { ProductGraphQlService } from 'src/app/_services/product-service/product-graphQl.service';

@Component({
    standalone: true,
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss'],
    imports: [
        CommonModule,
        ProductModalComponent,
        LoadingScreenComponent,
        ConfirmModalComponent,
        RouterModule,
        InfoModalComponent,
        MessagesNotificationComponent
    ]
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

    public product: ProductData;
    public loading = signal<boolean>(false);
    public error: string;
    public modalInfoText: string;
    public showMessage: boolean = false;
    public currentMessage: MessagesData;

    private productId: string;
    private destroy$: Subject<void> = new Subject<void>();

    @ViewChild('editProductModalComponent') editProductModalComponent: ProductModalComponent;
    @ViewChild('confirmModalComponent') confirmModalComponent: ConfirmModalComponent;
    @ViewChild('productInfoModal') productInfoModal: InfoModalComponent;

    constructor(
        private router: Router,
        private productService: ProductService,
        private route: ActivatedRoute,
        private chatService: ChatService,
        private productGraphService: ProductGraphQlService
    ) { }

    ngOnInit(): void {
        this.loading.set(true);
        this.route.params.subscribe((params: any) => {
            this.productId = params['id'] ? params['id'] : null;
        });
        this.getProduct();
        this.getNewProductWithSocket();
        this.getUpdatedProductWithSocket();
        this.getProductAfterDeleteWithSocket();
        this.getNewMessage();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public openEditModal(product: ProductData) {
        this.editProductModalComponent.openEditModal(product);
    }

    public deleteProduct(): void {
        this.productGraphService.deleteProduct(this.productId).pipe(
            first(),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe();
    }

    public editProduct(product: ProductData) {
        this.error = '';
        const isProductEdited: boolean = !(product.name === this.product?.name && product.description === this.product?.description);
        if (isProductEdited) {
            this.productGraphService.updateProduct(product).pipe(
                first(),
                catchError(error => {
                    this.error = error;
                    return throwError(error);
                })
            ).subscribe((data: ProductData[]) => {
                this.product = data.find((product: ProductData) => product._id === this.productId);
                this.editProductModalComponent.hideModal();
            });
        } else {
            this.editProductModalComponent.hideModal();
        }
    }

    private getProduct(): void {
        this.error = '';
        this.productGraphService.getProduct(this.productId).pipe(
            first(),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe((data: ProductData) => {
            this.product = data;
            this.loading.set(false);
        });
    }

    private getUpdatedProductWithSocket(): void {
        this.productService.getUpdatedProductWithSocket().pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: [ProductData[], {updatedProductId: string}]) => {
            this.product = data[0].find((product: ProductData) => product._id === this.productId);
            const updatedProduct = data[0].find((prod: ProductData) => prod._id === data[1].updatedProductId);
            this.modalInfoText = `Product '${updatedProduct.name}' has been updated.`;
            this.productInfoModal.openModal();
        });
    }

    private getProductAfterDeleteWithSocket(): void {
        this.productService.getProductAfterDeleteWithSocket().pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: [ProductData[], {deletedProductName: string}]) => {
            this.modalInfoText = `Product '${data[1].deletedProductName}' has been deleted.`;
            this.productInfoModal.openModal();
            if (data[1].deletedProductName === this.product.name) {
                setTimeout(() => {
                    this.router.navigate(['/products']);
                }, 1000);
            }
        });
    }

    private getNewProductWithSocket(): void {
        this.productService.getNewProductWithSocket().pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: ProductData) => {
            this.modalInfoText = `Product '${data.name}' has been added.`;
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
