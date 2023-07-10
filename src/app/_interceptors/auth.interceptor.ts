import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, first, throwError } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            const token = userData.token;
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${token ? token : null}`,
                    'Content-Type': 'application/json'
                }
            });
        }

        return next.handle(request).pipe(catchError(e => {
            if ([401].indexOf(e.status) !== -1) {
                this.authService.logout().pipe(first()).subscribe(
                    () => {
                        this.authService.isUserLoggedIn.set(null);
                        this.authService.manageLocalStorage();
                        this.router.navigate(['/login']);
                    }
                )
            }

            const error = e.error.message;
            return throwError(error);
        }))
    }
}
