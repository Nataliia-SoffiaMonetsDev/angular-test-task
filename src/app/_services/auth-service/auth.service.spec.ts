import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { UserData, LogoutResponse } from '../../shared/interfaces/data.interfaces';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
    let authService: AuthService;
    let httpTestingController: HttpTestingController;
    const userData: UserData = {
        userName: 'testUser',
        email: 'testUser@mail.com',
        password: 'password',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService],
        });

        authService = TestBed.inject(AuthService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('AuthService successfully created', () => {
        expect(authService).toBeDefined();
    });

    it('Register a new user', () => {
        authService.register(userData).subscribe((response) => {
            expect(response).toEqual(userData);
        });
        const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/registration`);
        expect(req.request.method).toBe('POST');
        req.flush(userData);
    });

    it('Log in a user', () => {
        authService.login(userData).subscribe((response) => {
            expect(response).toEqual(userData);
        });
        const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/login`);
        expect(req.request.method).toBe('POST');
        req.flush(userData);
    });

    it('Log out a user', () => {
        const mockLogoutResponse: LogoutResponse = {
            acknowledged: true,
            deletedCount: 1
        };
        authService.logout().subscribe((response) => {
            expect(response).toEqual(mockLogoutResponse);
            expect(authService.isLoggedIn()).toBeNull();
        });
        const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/logout`);
        expect(req.request.method).toBe('POST');
        req.flush(mockLogoutResponse);
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('Manage local storage', () => {
        authService.manageLocalStorage(userData);
        expect(localStorage.getItem('user')).toBe(JSON.stringify(userData));

        authService.manageLocalStorage();
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('Return user data if logged in', () => {
        authService.manageLocalStorage(userData);
        const loggedInUser = authService.isLoggedIn();
        expect(loggedInUser).toEqual(userData);
    });

    it('Return null if not logged in', () => {
        authService.manageLocalStorage();
        const loggedInUser = authService.isLoggedIn();
        expect(loggedInUser).toBeNull();
    });

    it('should retrieve a list of users', () => {
        const usersData: UserData[] = [
            {
                userName: 'Test',
                email: 'test@mail.com',
                password: 'password',
            },
            {
                userName: 'Test1',
                email: 'test1@mail.com',
                password: 'password',
            }
        ];

        authService.getUsers().subscribe((response) => {
            expect(response).toEqual(usersData);
        });

        const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/users`);
        expect(req.request.method).toBe('GET');
        req.flush(usersData);
    });

});