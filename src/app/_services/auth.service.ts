import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private resourceUrl: string = 'http://localhost:5000/auth';
    public isUserLoggedIn = signal<boolean>(false);

    constructor(private http: HttpClient) {
        this.isUserLoggedIn.set(this.isLoggedIn());
    }

    public register(body: any): Observable<any> {
        return this.http.post<any>(`${this.resourceUrl}/registration`, body);
    }

    public login(body: any): Observable<any> {
        return this.http.post<any>(`${this.resourceUrl}/login`, body);
    }

    public logout(): Observable<any> {
        return this.http.post<any>(`${this.resourceUrl}/logout`, {});
    }

    public manageSessionStorage(data?: any): void {
        data ? sessionStorage.setItem('user', JSON.stringify(data)) : sessionStorage.removeItem('user');
    }

    public isLoggedIn(): boolean {
        return !!sessionStorage.getItem('user');
    }
}
