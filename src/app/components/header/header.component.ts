import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { UserData } from 'src/app/shared/interfaces/data.interfaces';

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
    
    public userData: Signal<UserData>;

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.userData = computed(() => {
            return this.authService.isUserLoggedIn();
        });
    }

    public logOut(): void {
        this.authService.logout().pipe(first()).subscribe(() => {
            this.authService.isUserLoggedIn.set(null);
            this.authService.manageLocalStorage();
            this.router.navigate(['/login']);
        });
    }
}
