import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';
import { AuthInterceptor } from './_interceptors/auth.interceptor';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProductsListComponent } from './pages/products-page/products-list/products-list.component';

const config: SocketIoConfig = { url: environment.apiUrl, options: {} };

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FooterComponent,
        HeaderComponent,
        SocketIoModule.forRoot(config),
        LoginComponent,
        RegistrationComponent,
        ProductsPageComponent,
        ProductDetailsComponent,
        ProductsListComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        DatePipe,
        {
            provide: APOLLO_OPTIONS,
            useFactory: (httpLink: HttpLink) => {
                return {
                    cache: new InMemoryCache,
                    link: httpLink.create({
                        uri: 'http://ec2-16-171-151-81.eu-north-1.compute.amazonaws.com:5000/graphql'
                    })
                }
            },
            deps: [HttpLink]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
