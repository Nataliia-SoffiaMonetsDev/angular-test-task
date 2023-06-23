import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from '../shared/interfaces/data.interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private resourceUrl: string = environment.apiUrl;
    public isUserLoggedIn = signal<boolean>(false);

    constructor(private http: HttpClient) {
        this.isUserLoggedIn.set(this.isLoggedIn());
    }

    public register(body: UserData): Observable<UserData> {
        return this.http.post<UserData>(`${this.resourceUrl}/auth/registration`, body);
    }

    public login(body: UserData): Observable<UserData> {
        return this.http.post<UserData>(`${this.resourceUrl}/auth/login`, body, { withCredentials: true });
    }

    public logout(): Observable<any> {
        return this.http.post<any>(`${this.resourceUrl}/auth/logout`, {});
    }

    public manageLocalStorage(data?: UserData): void {
        data ? localStorage.setItem('user', JSON.stringify(data)) : localStorage.removeItem('user');
    }

    public isLoggedIn(): boolean {
        return !!localStorage.getItem('user');
    }
}
