import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../_services/auth-service/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let authService: AuthService;
    let router: Router;
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
            providers: [AuthGuard, AuthService]
        });
        guard = TestBed.inject(AuthGuard);
        authService = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
    });

    it('should allow navigation if user is logged in', () => {
        jest.spyOn(authService, 'isLoggedIn').mockReturnValue(userData);
        const result = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
        expect(result).toBe(true);
    });

    it('should navigate to login page and return false if user is not logged in', () => {
        jest.spyOn(authService, 'isLoggedIn').mockReturnValue(null);
        jest.spyOn(window, 'alert');
        const navigate = jest.spyOn(router, 'navigate');
        const result = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
        expect(navigate).toHaveBeenCalledWith(['/login']);
        expect(result).toBe(false);
        expect(window.alert).toHaveBeenCalledWith('Please login first');
    });
});