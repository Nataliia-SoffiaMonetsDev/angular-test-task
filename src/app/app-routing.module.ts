import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'registration',
        loadComponent: () => import('./pages/registration/registration.component').then(mod => mod.RegistrationComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(mod => mod.LoginComponent)
    },
    {
        path: 'products',
        loadComponent: () => import('./pages/products-page/products-page.component').then(mod => mod.ProductsPageComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'product-details/:id',
        loadComponent: () => import('./pages/product-details/product-details.component').then(mod => mod.ProductDetailsComponent),
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
