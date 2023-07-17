import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthInterceptor } from './auth.interceptor';
import { ProductService } from '../_services/product-service/product.service';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthService } from '../_services/auth-service/auth.service';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
    let service: AuthService;
    let router: Router;
    let interceptor: AuthInterceptor;
    let http: HttpClient;
    let httpMock: HttpTestingController;
    const userData = {
        "_id": "64a42b84ba332ad08a38045d",
        "email": "test@mail.com",
        "userName": "Name",
        "password": "$2b$05$5Ag5rjcSGMsy0zy6OZ1pBezJ5Ssm7/O6Y7ZfgcqOD4VwXfVhsDz36",
        "__v": 0,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTQyYjg0YmEzMzJhZDA4YTM4MDQ1ZCIsImVtYWlsIjoibmF0YUBtYWlsLmNvbSIsImlhdCI6MTY4OTE0NjU0OSwiZXhwIjoxNjg5MTg5NzQ5fQ.hh6Hyef7a7nYoWZUkO7bVxN8ikhBDckREx6uezWxfFU"
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [AuthInterceptor, AuthService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }]
        });
        interceptor = TestBed.inject(AuthInterceptor);
        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
        service = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
    });

    it('Add Authorization header with token from localStorage', () => {
        localStorage.setItem('user', JSON.stringify(userData));
        const requestUrl = 'https://localhost:5000/test';
        const response = { data: 'The request was successful' };
        http.get(requestUrl).subscribe(response => {
            expect(response).toEqual(response);
        });
        const req = httpMock.expectOne(requestUrl);
        expect(req.request.headers.get('Authorization')).toBe(`Bearer ${userData.token}`);
        req.flush(response);
    });

    it('Handle 401 error, logout user, clear localStorage, and navigate to login page', () => {
        const logout = jest.spyOn(service, 'logout').mockReturnValue(of(null));
        const manageLocalStorage = jest.spyOn(service, 'manageLocalStorage');
        const navigate = jest.spyOn(router, 'navigate');
        const requestUrl = 'https://localhost:5000/test';
        http.get(requestUrl).subscribe(error => {
            expect(error).toBe('User unauthorized');
        });
        const req = httpMock.expectOne(requestUrl);
        req.flush({ message: 'User unauthorized' }, { status: 401, statusText: 'Unauthorized' });
        expect(logout).toHaveBeenCalled();
        expect(service.isUserLoggedIn()).toEqual(null);
        expect(manageLocalStorage).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith(['/login']);
    });

});