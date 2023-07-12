import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth-service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard  {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (!this.authService.isLoggedIn()) {
            alert('Please login first')
            this.router.navigate(['/login']);
            return false;
        } else {
            return true;
        }
    }

}
