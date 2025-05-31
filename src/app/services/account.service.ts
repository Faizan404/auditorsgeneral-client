import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../interfaces/User';
import { DataService } from './state/dataservice.service';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl: string = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private dataService: DataService) {}

  authenticateUser(url: string, data: any) {
    return this.http.post<User>(this.baseUrl + url, data).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  login(userData: any) {
    return this.authenticateUser('account/login', userData);
  }

  register(userData: any) {
    return this.authenticateUser('account/register', userData);
  }

  forgetPassword(userData: any) {
    return this.http.post(this.baseUrl + 'account/forget-password', userData);
  }

  resetPassword(userData: any) {
    return this.http.post(this.baseUrl + 'account/reset-password', userData);
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    ['user', 'formData', 'adminRequest', 'report'].forEach((data: any) =>
      localStorage.removeItem(data)
    );

    this.dataService.draftParaTableContent =
      this.dataService.dacParaContent =
      this.dataService.pacParaContent =
        [];

    this.dataService.formData = {};
    this.dataService.activeActionBtns = false;

    this.currentUserSource.next(null);
  }
}
