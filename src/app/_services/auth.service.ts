import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public isLoggedInSubject = new BehaviorSubject<boolean>(false);
    public isLoggedIn$ = this.isLoggedInSubject.asObservable();
    private resourceUrl!: string;

    constructor(private http: HttpClient) {
        this.resourceUrl = 'http://localhost:5000/auth/';
        this.isLoggedInSubject.next(this.isLoggedIn());
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
