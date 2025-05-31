import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private service: AccountService, private toastr: ToastrService){}

  canActivate(): Observable<boolean>{
    return this.service.currentUser$.pipe(
      map(user => {
        if (user) return true;
        else {
          this.toastr.error("You are not permitted to perform this action, try to login first");
          return false;
        }
      })
    );
  }
  
}
