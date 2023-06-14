import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, first } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    isLoggedIn$!: Observable<boolean>;

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.isLoggedIn$ = this.authService.isLoggedIn$;
    }

    public logOut(): void {
        this.authService.logout().pipe(first()).subscribe(() => {
            this.authService.isLoggedInSubject.next(false);
            this.authService.manageLocalStorage();
            this.router.navigate(['/login']);
        });
    }
}
