import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { AuthenticationService } from '../_services/authentication-service.service';

@Injectable({providedIn:'root'})

export class AuthGuard  implements CanActivate{
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            // check if route is restricted by role
            if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
                // role not authorised so redirect to home page
                this.router.navigate(['/']);
                return false;
            }
            if (currentUser.role=='User') {
                // role not authorised so redirect to home page
                this.router.navigate(['employee']);
                return true;
            }
            else if (currentUser.role=='Admin') {
            //     // role not authorised so redirect to home page
                this.router.navigate(['admin']);
                return true;
            }

            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
}
}