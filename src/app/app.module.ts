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

const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

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
    SocketIoModule.forRoot(config)
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
