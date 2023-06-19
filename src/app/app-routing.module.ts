import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'registration',
        loadChildren: () => import('./pages/registration/registration.module').then(m => m.RegistrationModule) 
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
    },
    {
        path: 'products',
        loadChildren: () => import('./pages/products-page/products-page.module').then(m => m.ProductsPageModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'product-details/:id',
        loadChildren: () => import('./pages/product-details/product-details.module').then(m => m.ProductDetailsModule),
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
