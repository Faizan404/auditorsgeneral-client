import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuditformService } from 'src/app/services/audit/auditform.service';
import { DataService } from 'src/app/services/state/dataservice.service';

@Component({
  selector: 'app-form-hr',
  templateUrl: './form-hr.component.html',
  styleUrls: ['./form-hr.component.scss'],
})
export class FormHRComponent implements OnInit {
  //*           Reactive Forms
  // myFromHr: FormGroup = new FormGroup({});
  myFormPara: FormGroup = new FormGroup({});
  myFormCases: FormGroup = new FormGroup({});
  myFormDacDirectives: FormGroup = new FormGroup({});
  myFormPacDirectives: FormGroup = new FormGroup({});

  //*         Select field options
  casesType = [
    { value: '', label: 'Select case type' },
    { value: 'Court', label: 'Court Cases' },
    { value: 'NAB', label: 'NAB Cases' },
    { value: 'FIA', label: 'FIA Cases' },
  ];
  statusRecovery = [
    { value: '', label: 'Select recovery option' },
    { value: 'Recovery verified', label: 'Recovery verified' },
    { value: 'Recovery unverified', label: 'Recovery unverified' },
    { value: 'Under verification', label: 'Under verification' },
  ];
  statusAuditPara = [
    { value: '', label: 'Select recovery option' },
    { value: 'Actionable', label: 'Actionable' },
    { value: 'Pended', label: 'Pended' },
    { value: 'Settled', label: 'Settled' },
    { value: 'Pursuance of DAC level', label: 'Pursuance of DAC level' },
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auditService: AuditformService,
    private scroll: ViewportScroller,
    public dataService: DataService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.settingAdminRequest();
    this.initFileds();
    this.initializingFromHr();
    this.initializingFormPara();
    this.initializingFormCase();
    this.initializingFormDacs();
    this.initializingFormPacs();

    if (
      !this.dataService.myFromHr.get('auditParaNo')?.value &&
      !this.dataService.myFromHr.get('auditYear')?.value
    )
      return;

    this.dataService.gettingAvailableParas(
      `auditform/available-forms-data?auditParaNo=${
        this.dataService.myFromHr.get('auditParaNo')?.value
      }&auditYear=${this.dataService.myFromHr.get('auditYear')?.value}`
    );
  }

  scrollToSection(tragetSection: string) {
    this.scroll.scrollToAnchor(tragetSection);
  }

  initializingFromHr() {
    this.dataService.myFromHr = this.fb.group({
      auditParaNo: [
        this.dataService.formData.auditParaNo || '',
        Validators.required,
      ],
      auditYear: [
        this.dataService.formData.auditYear || '',
        Validators.required,
      ],
      auditPara: [''],
      federalMinister: [''],
      chairperson: [''],
      auditOfficer: [''],
      criteria: [''],
      formation: [''],
      dateIssuance: [''],
      dateFinalization: [''],
      departmentReply: [''],
      auditComments: [''],
      statusAuditPara: [''],
      statusRecovery: [''],
    });
  }

  initializingFormPara() {
    this.myFormPara = this.fb.group({
      subjectOfPara: [''],
      draftParaNo: ['', Validators.required],
      draftPara: ['', Validators.required],
    });
  }

  initializingFormCase() {
    this.myFormCases = this.fb.group({
      caseType: ['', Validators.required],
      caseName: ['', Validators.required],
    });
  }

  initializingFormDacs() {
    this.myFormDacDirectives = this.fb.group({
      dacDecisionDate: ['', Validators.required],
      dacDirectives: [''],
      complianceOfDACDirectives: [''],
    });
  }

  initializingFormPacs() {
    this.myFormPacDirectives = this.fb.group({
      pacDecisionDate: ['', Validators.required],
      pacDirectives: [''],
      complianceOfPACDirectives: [''],
    });
  }

  initFileds() {
    const formData = localStorage.getItem('formData');
    if (!formData) return;
    const formDataParsed = JSON.parse(formData);
    console.log(formDataParsed);
    this.dataService.formData = formDataParsed;
  }

  settingAdminRequest() {
    const data = localStorage.getItem('adminRequest');
    if (!data) return;
    const { auditParaNo, auditYear } = JSON.parse(data);

    this.dataService.gettingAvailableParas(
      `auditform/available-forms-data?auditParaNo=${auditParaNo}&auditYear=${auditYear}`
    );
  }

  parsingDateIssueFix(formData: any, fixFor: string) {
    if (fixFor === 'update-dac' || fixFor === 'auditform/create-dac') {
      this.myFormDacDirectives.value.dacDecisionDate = this.convertDate(
        formData.value.dacDecisionDate
      );
    } else if (fixFor === 'update-pac' || fixFor === 'auditform/create-pac') {
      this.myFormPacDirectives.value.pacDecisionDate = this.convertDate(
        formData.value.pacDecisionDate
      );
    } else if (fixFor === 'auditform/update-auditform') {
      this.dataService.myFromHr.value.dateIssuance = this.convertDate(
        formData.value.dateIssuance
      );
      this.dataService.myFromHr.value.dateFinalization = this.convertDate(
        formData.value.dateFinalization
      );
    }
  }

  submitPara(activeForm: any, url: string, formContent: any) {
    this.parsingDateIssueFix(activeForm, url);

    this.auditService
      .createParas(
        url,
        this.dataService.generateFormDataObj({
          ...activeForm.value,
          ...{
            auditParaNo: this.dataService.myFromHr.get('auditParaNo')?.value,
            auditYear: this.dataService.myFromHr.get('auditYear')?.value,
          },
        })
      )
      .subscribe({
        next: (res: any) => {
          // console.log(res, activeForm.value, '🥺');
          if (url === 'auditform/add-case') formContent.push(res);
          else formContent.push(activeForm.value);
          activeForm.reset();
        },
        error: (err) => {
          this.toastr.error(err.error);
          console.error(err);
        },
      });
  }

  deleteParaData(activeForm: any, url: string, formContent: any) {
    let currentData: any;

    currentData = ['draftParaNo', 'dacDecisionDate', 'pacDecisionDate']
      .map((field: any) => {
        currentData = activeForm.get(field)?.value;
        return currentData;
      })
      .filter((result: any) => result)[0];

    this.auditService.delParas({ currentData, url }).subscribe({
      next: () => {
        const index = formContent.findIndex((content: any): any => {
          if (url === 'del-para') return content.draftParaNo === currentData;
          else if (url === 'del-dac')
            return content.dacDecisionDate === currentData;
          else if (url === 'del-pac')
            return content.pacDecisionDate === currentData;
        });
        formContent.splice(index, 1);
        this.dataService.activeActionBtns = false;
        activeForm.reset();
        this.toastr.success(`Para ${currentData} successfully deleted`);
      },
      error: (err) => {
        this.toastr.error(err.error);
        console.error(err);
      },
    });
  }

  editParaData(activeForm: any, url: string, formContent: any) {
    this.parsingDateIssueFix(activeForm, url);
    this.auditService
      .editParas(
        {
          ...activeForm.value,
        },
        this.dataService.enableEditContent,
        url
      )
      .subscribe({
        next: () => {
          const index = formContent.findIndex((content: any): any => {
            if (url === 'update-draft')
              return content.draftParaNo === this.dataService.enableEditContent;
            else if (url === 'update-dac')
              return (
                content.dacDecisionDate.slice(0, 10) ===
                this.dataService.enableEditContent.slice(0, 10)
              );
            else if (url === 'update-pac')
              return (
                content.pacDecisionDate.slice(0, 10) ===
                this.dataService.enableEditContent.slice(0, 10)
              );
          });
          console.log(activeForm.value);
          formContent[index] = activeForm.value;
          this.dataService.activeActionBtns = false;
          activeForm.reset();
          this.toastr.success(
            `Para ${this.dataService.enableEditContent} successfully edited`
          );
        },
        error: (err) => {
          this.toastr.error(err.error);
          console.error(err);
        },
      });
  }

  renderData(data: any, formContent: any, btnSection: string, activeForm: any) {
    let renderDataObj = {};
    formContent.forEach((content: any): any => {
      if (btnSection === 'draft' && content.draftParaNo === data)
        return (renderDataObj = { ...content });
      else if (
        btnSection === 'dac' &&
        content.dacDecisionDate.slice(0, 10) === data.slice(0, 10)
      )
        return (renderDataObj = { ...content });
      else if (
        btnSection === 'pac' &&
        content.pacDecisionDate.slice(0, 10) === data.slice(0, 10)
      )
        return (renderDataObj = { ...content });
      else if (btnSection === 'case' && content.caseId === data)
        return (renderDataObj = { ...content });
    });
    activeForm.patchValue(renderDataObj);
    this.dataService.enableEditContent = data;
    this.dataService.activeActionBtns = true;
  }

  convertDate(dateString: any) {
    if (!dateString) return;

    // Create a new Date object, adjusting for the local time zone
    let date = new Date(dateString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

    // Use toISOString method and slice to get the date in 'YYYY-MM-DD' format
    var formattedDate = date.toISOString().slice(0, 10);

    return formattedDate;
  }

  editAuditForm(activeForm: any) {
    this.parsingDateIssueFix(activeForm, 'auditform/update-auditform');
    this.auditService
      .editFormHr(
        this.dataService.generateFormDataObj(activeForm.value),
        'auditform/update-auditform'
      )
      .subscribe({
        next: (res: any) =>
          this.toastr.success(
            `Audit Form of Para No. ${res.auditParaNo} successfully updated`
          ),
        error: (err) => {
          console.error(err), this.toastr.error(err.error);
        },
      });
  }

  deleteCase(
    id: number,
    formContent: Array<{
      caseId: number;
      caseType: string;
      caseName: string;
    }>
  ) {
    this.auditService.delCases(id).subscribe({
      next: () => {
        formContent.splice(
          formContent.findIndex((auditCase: any) => auditCase.caseId === id),
          1
        );
        this.myFormCases.reset();
        this.toastr.success('Case successfully deleted');
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.error);
      },
    });
  }

  editAuditCase(
    caseForm: any,
    id: number,
    formContent: Array<{
      caseId: number;
      caseType: string;
      caseName: string;
    }>
  ) {
    this.auditService.editCase(id, caseForm.value).subscribe({
      next: (res) => {
        const { caseId, caseType, caseName }: any = res;
        const index = formContent.findIndex(
          (auditCase: any) => auditCase.caseId === id
        );
        formContent[index] = { caseId, caseType, caseName };
        this.dataService.activeActionBtns = false;
        caseForm.reset();
        this.toastr.success('Case successfully edited');
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.error);
      },
    });
  }
}
