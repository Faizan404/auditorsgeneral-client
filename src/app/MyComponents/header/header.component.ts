import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { DataService } from 'src/app/services/state/dataservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, public service: AccountService, public dataService: DataService) {}

  ngOnInit(): void {}

  getUserLogout() {
    this.service.logout();
    this.router.navigateByUrl('/');
  }

  displayProfile() {
    this.router.navigate(['profile']);
  }

  navigateToHome() {
    localStorage.removeItem('formData');
    this.dataService.draftParaTableContent =
      this.dataService.dacParaContent =
      this.dataService.pacParaContent =
        [];

    this.dataService.formData = {};
    this.dataService.activeActionBtns = false;
    this.router.navigateByUrl('/home');
  }
}
