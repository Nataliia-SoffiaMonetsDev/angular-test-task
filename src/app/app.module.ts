import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { AddProductModalComponent } from './pages/products-page/add-product-modal/add-product-modal.component';
import { ProductCardComponent } from './pages/products-page/product-card/product-card.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { TextInputComponent } from './shared/inputs/text-input/text-input.component';
import { TextareaInputComponent } from './shared/inputs/textarea-input/textarea-input.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    ProductsPageComponent,
    ProductDetailsComponent,
    AddProductModalComponent,
    ProductCardComponent,
    TextInputComponent,
    TextareaInputComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ModalModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [BsModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
