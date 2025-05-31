import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AdminService } from 'src/app/services/admin/admin.service';
import { DataService } from 'src/app/services/state/dataservice.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  myFormAdminSearch: FormGroup = new FormGroup({});
  activeTab: boolean = true;
  currentTab: string = 'users';
  confirmationModal: boolean = true;
  adminTableKeys: Array<string> = [];
  adminTableValues: any = [];

  dataIdForDel: string = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    public accountService: AccountService
  ) {}

  initializingAdminSearchForm() {
    this.myFormAdminSearch = this.fb.group({
      search: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.dataService.removeCookiesOnRedirect([
      'profileData',
      'formData',
      'report',
      'adminRequest',
    ]);
    this.initializingAdminSearchForm();
    this.controllingAdminTabs(this.currentTab);
  }

  settingTableContent(data: any) {
    this.adminTableValues = [];
    this.adminTableKeys = Object.keys(data[0]);
    data.forEach((item: { [s: string]: unknown } | ArrayLike<unknown>) =>
      this.adminTableValues.push(Object.values(item))
    );
  }

  controllingAdminTabs(targetTab: string) {
    this.activeTab = targetTab === 'users' ? true : false;
    this.currentTab = targetTab;
    this.adminService.getAllTabData(targetTab).subscribe({
      next: (res) =>
        Array.isArray(res) ? this.settingTableContent(res) : console.log(res),
      error: (err) => this.toastr.error(err.error),
    });
  }

  controllingFilterSearch() {
    this.adminService
      .getQueryData(this.currentTab, this.myFormAdminSearch.value.search)
      .subscribe({
        next: (res) =>
          Array.isArray(res) ? this.settingTableContent(res) : console.log(res),
        error: (err) => this.toastr.error(err.error),
      });
    this.myFormAdminSearch.reset();
  }

  editRowData(data: any) {
    let adminDataObj = {};
    let url = '';

    if (this.currentTab === 'users') {
      url = '/profile';
      adminDataObj = { personnelNo: data[0] };
    } else if ('forms') {
      url = '/home/form-hr';
      adminDataObj = { auditParaNo: data[0], auditYear: data[1] };
    }
    localStorage.setItem('adminRequest', JSON.stringify(adminDataObj));
    this.router.navigateByUrl(url);
  }
  deleteRowData(data: any) {
    const [id, ...rest] = data;
    this.dataIdForDel = id;
    this.confirmationModal = false;
  }
  cancelDeleteAction() {
    this.confirmationModal = true;
  }

  permanentlyDeleteAction() {
    // console.log(this.dataIdForDel, this.dataIdForDel.length > 1, this.adminTableValues, '😂');
    this.adminService.deleteAccount(this.dataIdForDel, this.dataIdForDel.length > 1 ? 'personnelNo' : 'formId').subscribe({
      next: () => {
        const index = this.adminTableValues.findIndex(
          (itemList: any[]) => itemList[0] === this.dataIdForDel
        );
        this.adminTableValues.splice(index, 1);
        this.dataIdForDel = '';
        this.toastr.success('Successfully Deleted');
      },
      error: (err) => console.error(err),
      // error: (err) => this.toastr.error('Something went wrong'),
    });
    this.confirmationModal = true;
  }
}
