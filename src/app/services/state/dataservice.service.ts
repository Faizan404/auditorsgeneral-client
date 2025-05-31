import { Injectable } from '@angular/core';
import { AuditformService } from '../audit/auditform.service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  //TODO           ******* FORM HR *******

  myFromHr: FormGroup = new FormGroup({});

  draftParaTableContent: Array<{
    draftParaNo: string;
    draftPara: string;
    subjectOfPara: string;
  }> = [];

  dacParaContent: Array<{
    dacDecisionDate: Date;
    dacDirectives: string;
    complianceOfDACDirectives: string;
  }> = [];

  pacParaContent: Array<{
    pacDecisionDate: Date;
    pacDirectives: string;
    complianceOfPACDirectives: string;
  }> = [];

  auditCasesContent: Array<{
    caseId: number;
    caseType: string;
    caseName: string;
  }> = [];

  formData: any = {};
  activeActionBtns: boolean = false;
  enableEditContent: any;

  //TODO           ******* FORM HR *******

  //TODO           ******* FILTER HR *******
  updateFormSelect = [{ value: '', label: 'select your form' }];

  // TODO         ******** PROFILE *******
  profileDataList: any = [];
  employeePersonalList: Array<{
    empTotalChildren: any;
    personnelNo: string;
    name: string;
    fatherName: string;
    gender: string;
    height: string;
    dob: Date;
    phoneNo: string;
    address: string;
    email: string;
    maritalStatus: string;
    bankAccount: string;
    bankName: string;
    picture: string;
    isActive: string;
  }> = [];
  employeeJobList: Array<{
    basicPension: number;
    basicSalary: number;
    basicScale: number;
    callCenterNo: string;
    conveyanceAllowance: number;
    currentDesignation: string;
    currentSalary: number;
    department: string;
    division: string;
    doa: Date;
    dor: Date;
    grossPension: number;
    houseHold: string;
    houseRent: number;
    employeeId: string;
    startingDesignation: string;
  }> = [];

  profileEducation: Array<{
    eduId: number;
    degree: string;
    eduType: string;
    employeeId: string;
    grade: string;
    obtainingMarks: number;
    passingYear: number;
    totalMarks: number;
  }> = [];

  profileFamilyChild: Array<{
    childId: number;
    name: string;
    dob: Date;
    employeeId: string;
    education: string;
    gender: string;
  }> = [];

  profileFamilySpouse: Array<{
    spouseId: number;
    name: string;
    fatherName: string;
    dob: Date;
    education: string;
    employeeId: string;
  }> = [];

  profileEmpJobHistory: any = [];

  constructor(private auditService: AuditformService) {}

  generateFormDataObj(formDataObj: any) {
    const activeUser = localStorage.getItem('user');
    if (!activeUser) return;
    const formHrData = {
      ...formDataObj,
      ...{
        employeeNo: JSON.parse(activeUser).personnelNo,
      },
    };
    return formHrData;
  }

  settingUpdateField(formData: any) {
    this.updateFormSelect = [{ value: '', label: 'select your form' }];
    formData.forEach((formEl: any) => {
      this.updateFormSelect.push({
        value: JSON.stringify(formEl),
        label: `Audit Para No: ${formEl.auditParaNo}, Audit Year: ${formEl.auditYear}`,
      });
    });
  }

  populateUpdateFileld() {
    const empData = localStorage.getItem('user');
    if (!empData) return;
    const employeeNo = JSON.parse(empData).personnelNo;
    this.auditService.getAllAvailableForms(employeeNo).subscribe({
      next: (res) => {
        this.settingUpdateField(res);
        console.log(res);
      },
      error: (err) => console.error(err),
    });
  }

  // gettingAvailableParas(endPoint: string, auditForm: any) {
  gettingAvailableParas(endPoint: string) {
    this.auditService.getAllParas(endPoint).subscribe({
      next: (res: any) => {
        const { auditDetails, auditParas, auditDacs, auditPacs, auditCases } =
          res;
        this.draftParaTableContent = [...auditParas];
        this.dacParaContent = [...auditDacs];
        this.pacParaContent = [...auditPacs];
        this.auditCasesContent = [...auditCases];

        localStorage.setItem('formData', JSON.stringify(auditDetails[0]));

        const {
          auditComments,
          auditOfficer,
          auditPara,
          auditParaNo,
          auditYear,
          chairperson,
          criteria,
          dateOfAuditReportFinalization,
          dateOfIssuanceOfAuditObservation,
          departmentReply,
          federalMinister,
          formation,
          statusOfAuditPara,
          statusOfRecovery,
        } = auditDetails[0];

        this.myFromHr.patchValue({
          auditParaNo,
          auditYear,
          auditPara,
          federalMinister,
          chairperson,
          auditOfficer,
          criteria,
          formation,
          dateIssuance: dateOfIssuanceOfAuditObservation,
          dateFinalization: dateOfAuditReportFinalization,
          departmentReply,
          auditComments,
          statusAuditPara: statusOfAuditPara,
          statusRecovery: statusOfRecovery,
        });
        console.log(res, '🥳');
      },
      error: (err) => console.error(err),
    });
  }

  removeCookiesOnRedirect(cookieList: Array<string>) {
    cookieList.forEach((data: any) => localStorage.removeItem(data));
  }
}
