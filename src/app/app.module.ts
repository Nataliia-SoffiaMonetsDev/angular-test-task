import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { AddProductModalComponent } from './pages/products-page/add-product-modal/add-product-modal.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { TextInputComponent } from './shared/inputs/text-input/text-input.component';
import { TextareaInputComponent } from './shared/inputs/textarea-input/textarea-input.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingScreenComponent } from './shared/loading-screen/loading-screen.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { ProductsListComponent } from './pages/products-page/products-list/products-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    ProductsPageComponent,
    ProductDetailsComponent,
    AddProductModalComponent,
    TextInputComponent,
    TextareaInputComponent,
    LoadingScreenComponent,
    RegistrationComponent,
    ProductsListComponent
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
