import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { LogoutResponse, UserData } from '../shared/interfaces/data.interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private resourceUrl: string = environment.apiUrl;
    public isUserLoggedIn = signal<UserData>(null);

    constructor(private http: HttpClient) {
        this.isUserLoggedIn.set(this.isLoggedIn());
    }

    public register(body: UserData): Observable<UserData> {
        return this.http.post<UserData>(`${this.resourceUrl}/auth/registration`, body);
    }

    public login(body: UserData): Observable<UserData> {
        return this.http.post<UserData>(`${this.resourceUrl}/auth/login`, body, { withCredentials: true });
    }

    public logout(): Observable<LogoutResponse> {
        return this.http.post<LogoutResponse>(`${this.resourceUrl}/auth/logout`, {}, { withCredentials: true });
    }

    public manageLocalStorage(data?: UserData): void {
        data ? localStorage.setItem('user', JSON.stringify(data)) : localStorage.removeItem('user');
    }

    public isLoggedIn(): UserData {
        return JSON.parse(localStorage.getItem('user'));
    }

    public getUsers(): Observable<UserData[]> {
        return this.http.get<UserData[]>(`${this.resourceUrl}/auth/users`);
    }
}
