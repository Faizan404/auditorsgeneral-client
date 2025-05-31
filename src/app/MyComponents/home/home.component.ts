import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnectableObservable } from 'rxjs';
import { AuditformService } from 'src/app/services/audit/auditform.service';
import { FormHRComponent } from '../form-hr/form-hr.component';
import { DataService } from 'src/app/services/state/dataservice.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  myUpdateFormField: FormGroup = new FormGroup({});
  myCreateFormField: FormGroup = new FormGroup({});

  // updateFormSelect = [{ value: '', label: 'select your form' }];

  constructor(
    private router: Router,
    private auditService: AuditformService,
    private fb: FormBuilder,
    public dataService: DataService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.dataService.removeCookiesOnRedirect([
      'formData',
      'adminRequest',
      'report',
      'profileData',
    ]);
    this.initializingNewForm();
    this.initializingUpdateForm();
    this.dataService.populateUpdateFileld();
  }

  initializingNewForm() {
    this.myCreateFormField = this.fb.group({
      auditParaNo: ['', Validators.required],
      auditYear: ['', Validators.required],
    });
  }

  initializingUpdateForm() {
    this.myUpdateFormField = this.fb.group({
      updateFormSelect: ['', Validators.required],
    });
  }

  getSelectedFormOptionsData(updateForm: any) {
    const { auditParaNo, auditYear } = JSON.parse(
      updateForm.value.updateFormSelect
    );

    this.dataService.gettingAvailableParas(
      `auditform/available-forms-data?auditParaNo=${auditParaNo}&auditYear=${auditYear}`
    );
    this.router.navigateByUrl('home/form-hr');
  }

  createAuditForm() {
    this.auditService
      .getInitAuditForm(
        this.dataService.generateFormDataObj(this.myCreateFormField.value)
      )
      .subscribe({
        next: (res) => {
          localStorage.setItem('formData', JSON.stringify(res));
          this.router.navigateByUrl('/home/form-hr');
        },
        error: (err) => {
          this.toastr.error(err.error);
          console.error(err);
        },
      });
  }
}
