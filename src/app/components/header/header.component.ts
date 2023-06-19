import { CommonModule } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';
import { AppRoutingModule } from 'src/app/app-routing.module';

@Component({
    standalone: true,
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        CommonModule,
        AppRoutingModule
    ]
})
export class HeaderComponent implements OnInit {
    
    public isLoggedIn: any;

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.isLoggedIn = computed(() => {
            return this.authService.isUserLoggedIn();
        })
    }

    public logOut(): void {
        this.authService.logout().pipe(first()).subscribe(() => {
            this.authService.isUserLoggedIn.set(false);
            this.authService.manageSessionStorage();
            this.router.navigate(['/login']);
        });
    }
}
