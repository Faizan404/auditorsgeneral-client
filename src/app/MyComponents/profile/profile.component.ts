import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { UserProfileService } from 'src/app/services/profile/user-profile.service';
import { DataService } from 'src/app/services/state/dataservice.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  myProfilePersonalForm: FormGroup = new FormGroup({});
  myProfileEducationForm: FormGroup = new FormGroup({});
  myProfileFamilyForm: FormGroup = new FormGroup({});
  myProfileJobForm: FormGroup = new FormGroup({});
  myProfileJobHistoryForm: FormGroup = new FormGroup({});

  isFormHidden: boolean = false;
  isTabActive: boolean = true;

  isAllowEdit: boolean = false;
  subFormEditData: Array<{
    subFormDataId: string;
    subFormDataList: Array<any>;
    editedData: any;
    subFormType: string;
  }> = [];

  eduTab: boolean = true;
  higherEduTab: boolean = false;
  professionalQualificationTab: boolean = false;
  eduType: string = 'education';
  eduPseudoBeforeContent: string = 'EDUCATION';

  eduDataKeeper: Array<{
    eduId: number;
    degree: string;
    eduType: string;
    employeeId: string;
    grade: string;
    obtainingMarks: number;
    passingYear: number;
    totalMarks: number;
  }> = [];

  profileHelperData: any = {};

  genderOptions = [
    { value: '', label: 'select your gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  maritalStatusOptions = [
    { value: '', label: 'select your marital status' },
    { value: 'Married', label: 'Married' },
    { value: 'Unmarried', label: 'Unmarried' },
  ];

  educationOptions = [
    { value: '', label: 'select your education' },
    { value: 'Primary', label: 'Primary' },
    { value: 'Middle', label: 'Middle' },
    { value: 'Matric', label: 'Matric' },
  ];

  higherEducationOptions = [
    { value: '', label: 'select your higher education' },
    { value: 'FSC', label: 'FSC' },
    { value: 'ICS', label: 'ICS' },
    { value: 'Icom', label: 'Icom' },
    { value: 'DAE', label: 'DAE' },
    { value: 'F.A', label: 'F.A' },
  ];

  professionalQualificationOptions = [
    { value: '', label: 'select your profesional qualification' },
    { value: 'ADP', label: 'ADP' },
    { value: 'BS GIS', label: 'BS GIS' },
  ];

  employeeDivision = [{ value: '', label: 'select your division' }];

  // ?    From Data are stored in these lists
  familyType: string = 'children';
  childTab: boolean = true;
  spouseTab: boolean = false;
  familyPseudoBeforeContent: string = 'CHILDREN';

  checkAdmin: any;
  // profileDataList: any = [];
  profileData: any = [];

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    public dataService: DataService,
    public accountService: AccountService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.removeCookiesOnRedirect(['formData', 'report']);
    this.initializingProfilePersonal();
    this.initializingProfileEducation();
    this.initializingProfileFamily();
    this.initializingProfileJob();
    this.initializingProfileJobHistory();
    this.settingUpProfileData();
    this.initForms();
    this.filterCards();
  }

  initForms() {
    this.dataService.profileDataList = localStorage.getItem('profileData');
    if (!this.dataService.profileDataList) return;
    return (this.dataService.profileDataList = JSON.parse(
      this.dataService.profileDataList
    ));
  }

  modiftRawDate(rawDate: any) {
    // Create a Date object from the string
    // if (!rawDate) return rawDate;
    const date = new Date(rawDate);

    // Extract the year, month, and day
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-indexed, so add 1
    const day = ('0' + date.getDate()).slice(-2); // Pad with a zero if necessary

    // Format the date as "YYYY-MM-DD"
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate; // Outputs: "2024-02-16"
  }

  initializingProfilePersonal() {
    this.profileData = [];
    let totalChildren = 0;

    if (this.initForms()) {
      const { empsData, empChildrenData } = this.initForms();
      this.profileData = [...empsData];
      totalChildren = empChildrenData.length;
    }

    this.myProfilePersonalForm = this.fb.group({
      personnelNo: [this.profileData[0]?.personnelNo ?? ''],
      name: [this.profileData[0]?.name ?? ''],
      fatherName: [this.profileData[0]?.fatherName ?? ''],
      gender: [this.profileData[0]?.gender ?? ''],
      height: [this.profileData[0]?.height ?? ''],
      dob: [this.profileData[0]?.dob ?? '2000-01-01'],
      phoneNo: [this.profileData[0]?.phoneNo ?? ''],
      address: [this.profileData[0]?.address ?? ''],
      email: [this.profileData[0]?.email ?? ''],
      maritalStatus: [this.profileData[0]?.maritalStatus ?? ''],
      bankName: [this.profileData[0]?.bankName ?? ''],
      bankAccount: [this.profileData[0]?.bankAccount ?? ''],
      totalChild: [totalChildren],
      picture: [this.profileData[0]?.picture ?? ''],
    });

    if (this.checkAdmin) return;
    ['personnelNo', 'email', 'totalChild'].forEach((field) =>
      this.myProfilePersonalForm.controls[field].disable()
    );
  }

  initializingProfileEducation() {
    this.myProfileEducationForm = this.fb.group({
      degree: [''],
      passingYear: [new Date().getFullYear()],
      grade: [''],
      totalMarks: [0],
      obtainingMarks: [0],
    });
  }

  initializingProfileFamily() {
    this.myProfileFamilyForm = this.fb.group({
      name: [''],
      fatherName: [''],
      dob: ['2000-01-01'],
      education: [''],
      gender: [''],
    });
    this.myProfileFamilyForm.controls['fatherName'].disable();
  }

  initializingProfileJob() {
    let profileJobData: any[] = [];

    if (this.initForms()) {
      const { empJobData, empLeaveData } = this.initForms();
      profileJobData = [...empJobData, ...empLeaveData];
    }

    this.myProfileJobForm = this.fb.group({
      division: [profileJobData[0]?.division ?? ''],
      department: [profileJobData[0]?.department ?? ''],
      currentDesignation: [profileJobData[0]?.currentDesignation ?? ''],
      basicScale: [profileJobData[0]?.basicScale ?? 1],
      startingDesignation: [profileJobData[0]?.startingDesignation ?? ''],
      dor: [
        this.profileData[0]?.dob
          ? this.calcRetirement(this.profileData[0]?.dob)
          : '2000-01-01',
      ],
      doa: [profileJobData[0]?.doa ?? '2000-01-01'],
      basicSalary: [profileJobData[0]?.basicSalary ?? 0],
      currentSalary: [profileJobData[0]?.currentSalary ?? 0],
      houseHold: [profileJobData[0]?.houseAllocated ?? 0],
      houseRent: [profileJobData[0]?.houseRent ?? 0],
      conveyanceAllowance: [profileJobData[0]?.conveyanceAllowance ?? 0],
      callCenterNo: [profileJobData[0]?.ccNo ?? ''],
      basicPension: [profileJobData[0]?.basicPension ?? 0],
      grossPension: [profileJobData[0]?.grossPension ?? 0],
      lfp: [0],
      lwf: [0],
      lwp: [0],
      cl: [0],
      al: [0],
    });

    if (this.checkAdmin) return;
    ['lfp', 'lwf', 'lwp', 'cl', 'al'].forEach((leave) =>
      this.myProfileJobForm.controls[leave].disable()
    );
  }

  initializingProfileJobHistory() {
    this.myProfileJobHistoryForm = this.fb.group({
      startingDate: ['2000-01-01'],
      endingDate: ['2000-01-01'],
      department: [''],
      prevDesignation: [''],
      prevSalary: [''],
      wit: [''],
      witStartDate: ['2000-01-01'],
      witEndDate: ['2000-01-01'],
    });
  }

  calcRetirement(birthDate: Date) {
    if (birthDate.toString() === '0001-01-01') return;
    // Parse the birth date string into a Date object
    const birthDateObj = new Date(birthDate.toString());

    // Get the current date
    const currentDate = new Date();

    // Calculate the employee's current age
    let age = currentDate.getFullYear() - birthDateObj.getFullYear();
    const m = currentDate.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < birthDateObj.getDate())) {
      age--; // Subtract 1 if the current date is before the birth date in the current year
    }

    // Calculate the remaining years to reach 60
    const yearsToRetirement = 60 - age;

    // Add the remaining years to the current date
    currentDate.setFullYear(currentDate.getFullYear() + yearsToRetirement);

    // Format the retirement date in the "YYYY-MM-DD" format
    const retirementDate = currentDate.toISOString().split('T')[0];
    // console.log(retirementDate);
    return retirementDate;
  }

  makeTabActiveAndFormUnhide(formType: string) {
    if (formType === 'p') {
      this.isFormHidden = false;
      this.isTabActive = true;
    } else if (formType === 'j') {
      this.isFormHidden = true;
      this.isTabActive = false;
    }
  }

  helperControllingEduTabs(...args: any) {
    const [tabEdu, tabHEdu, tabPQ, cardContent, typeEdu, eduList] = args;
    this.eduTab = tabEdu;
    this.higherEduTab = tabHEdu;
    this.professionalQualificationTab = tabPQ;
    this.eduPseudoBeforeContent = cardContent;
    this.eduType = typeEdu;

    this.eduDataKeeper = eduList.filter(
      (card: { eduType: any }) => card.eduType === typeEdu
    );
  }

  helperControllingFamilyTabs(...args: any) {
    const [tabChild, tabSpouse, cardContent] = args;
    this.childTab = tabChild;
    this.spouseTab = tabSpouse;
    this.familyPseudoBeforeContent = cardContent;
  }

  controllingEduTabs(...args: any) {
    this.myProfileEducationForm.reset();

    // this.filterCards();
    const [targetedTab, eduList] = args;

    this.eduType = targetedTab;

    if (targetedTab === 'education')
      this.helperControllingEduTabs(
        true,
        false,
        false,
        'EDUCATION',
        'education',
        eduList
      );
    else if (targetedTab === 'higher education')
      this.helperControllingEduTabs(
        false,
        true,
        false,
        'HIGHER EDUCATION',
        'higher education',
        eduList
      );
    else if (targetedTab === 'professional qualification')
      this.helperControllingEduTabs(
        false,
        false,
        true,
        'CREDENTIAL',
        'professional qualification',
        eduList
      );
  }

  controllFamilyTabs(targetedTab: string) {
    this.myProfileFamilyForm.reset();

    this.familyType = targetedTab;

    if (targetedTab === 'children') {
      this.helperControllingFamilyTabs(true, false, 'CHILDREN');
      this.myProfileFamilyForm.controls['fatherName'].disable();
      this.myProfileFamilyForm.controls['gender'].enable();
    } else if (targetedTab === 'spouse') {
      this.helperControllingFamilyTabs(false, true, 'SPOUSE');
      this.myProfileFamilyForm.controls['fatherName'].enable();
      this.myProfileFamilyForm.controls['gender'].disable();
    }
  }

  settingUpProfileData() {
    let personnelNo = null;
    // ? check if the request comes from the admin
    this.checkAdmin = localStorage.getItem('adminRequest');
    if (this.checkAdmin) {
      personnelNo = JSON.parse(this.checkAdmin).personnelNo;
    } else {
      const activeUser = localStorage.getItem('user');
      if (!activeUser) return this.accountService.logout();
      const { token, ...rest } = JSON.parse(activeUser);
      personnelNo = rest.personnelNo;
      this.profileHelperData = rest;
    }

    if (localStorage.getItem('profileData')) return;
    console.log('***** REQUEST SENTS *****');
    this.userProfileService.getProfileData(personnelNo).subscribe({
      next: (res) => {
        this.dataService.profileDataList = { ...res };
        console.log({ ...res }, '🤞🤞');
        localStorage.setItem('profileData', JSON.stringify({ ...res }));
        this.filterCards();
      },
      error: (err) => console.error(err),
    });
  }

  checkThenProcessJobData(data: any) {
    this.userProfileService
      .helperProfileData(data, this.userProfileService.empPersonalOrJobData)
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Changes you have made detected successfully');
          localStorage.removeItem('profileData');
        },
        error: (err) =>
          this.toastr.error(
            'Invalid data passing in the form, Please fill the form correctly'
          ),
      });
  }

  formatDate(rawDate: any) {
    let date = new Date(rawDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  modifyProfileData() {
    let activeForm, formType: string;
    let profilePersonal: any;

    if (this.isTabActive) {
      activeForm = this.myProfilePersonalForm.value;
      formType = 'personal';
    } else {
      activeForm = this.myProfileJobForm.value;
      formType = 'job';
    }

    profilePersonal = {
      ...activeForm,
      ...this.profileHelperData,
    };
    if (formType === 'personal') {
      profilePersonal.dob = this.formatDate(profilePersonal.dob);
    } else {
      profilePersonal.doa = this.formatDate(profilePersonal.doa);
      profilePersonal.dor = this.formatDate(profilePersonal.dor);
    }

    console.log(formType, profilePersonal, '😒');

    this.userProfileService
      .updateProfileData(formType, profilePersonal)
      .subscribe({
        next: (res) => {
          typeof res === 'boolean'
            ? this.checkThenProcessJobData(res)
            : this.toastr.success(
                'Changes you have made detected successfully'
              );
          localStorage.removeItem('profileData');
        },

        error: (err) =>
          this.toastr.error(
            'Invalid data passing in the form, Please fill the form correctly'
          ),
      });
  }

  // TODO: Education , Family and Job History

  filterCards() {
    const profileData = localStorage.getItem('profileData');
    if (!profileData) return;
    const { empSpouseData, empJobHistoryData, empEdusData, empChildrenData } =
      JSON.parse(profileData);

    // console.log(empSpouseData, empJobHistoryData, empEdusData, empChildrenData);
    this.eduDataKeeper = empEdusData.filter(
      (card: { eduType: any }) => card.eduType === 'education'
    );

    this.dataService.profileFamilyChild = [...empChildrenData];
    this.dataService.profileFamilySpouse = [...empSpouseData];
    this.dataService.profileEmpJobHistory = [...empJobHistoryData];
    this.dataService.profileEducation = [...empEdusData];
  }

  processingSubFormData(urlEndPoint: string, resData: any) {
    if (urlEndPoint === 'add-education') {
      this.dataService.profileEducation.push(resData);
      this.filterCards();
    } else if (urlEndPoint === 'add-children')
      this.dataService.profileFamilyChild.push(resData);
    else if (urlEndPoint === 'add-spouse')
      this.dataService.profileFamilySpouse.push(resData);
    else if (urlEndPoint === 'add-job-history')
      this.dataService.profileEmpJobHistory.push(resData);
  }

  updateSubFormsDeatil() {
    const { subFormDataId, subFormDataList, editedData, subFormType } =
      this.subFormEditData[0];

    let endPoint = '';

    if (subFormType === 'education')
      endPoint = `profile/update-education?eduId=${subFormDataId}`;
    else if (subFormType === 'children')
      endPoint = `profile/update-child?childId=${subFormDataId}`;
    else if (subFormType === 'spouse')
      endPoint = `profile/update-spouse?spouseId=${subFormDataId}`;
    else if (subFormType === 'job-history')
      endPoint = `profile/update-job-history?jobHistoryId=${subFormDataId}`;

    this.userProfileService
      .updateSubFormData(endPoint, {
        ...editedData.value,
        eduType: subFormType,
        employeeId: this.profileHelperData.personnelNo,
      })
      .subscribe({
        next: (res: any) => {
          const index = subFormDataList.findIndex(
            (data: any) =>
              data.eduId === subFormDataId ||
              data.childId === subFormDataId ||
              data.spouseId === subFormDataId ||
              data.jobHistoryId === subFormDataId
          );
          subFormDataList[index] = res;
          this.toastr.success(`${subFormType} data edited successfully`);
          localStorage.removeItem('profileData');
        },
        error: () =>
          this.toastr.error(
            `Data ${subFormType} form is invalid, please add valid data`
          ),
      });
  }

  postSubFormsDetail(subFormType: string) {
    if (this.isAllowEdit) return this.updateSubFormsDeatil();

    let formData = {};
    let urlEndPoint: string = '';
    let jobHistoryData: any = {};

    if (subFormType === 'education') {
      formData = {
        ...this.myProfileEducationForm.value,
        eduType: this.eduType,
      };
      urlEndPoint = 'add-education';
    } else if (subFormType === 'family') {
      formData = this.myProfileFamilyForm.value;
      if (this.familyType === 'children') urlEndPoint = 'add-children';
      else if (this.familyType === 'spouse') urlEndPoint = 'add-spouse';
    } else if (subFormType === 'job-history') {
      formData = jobHistoryData = this.myProfileJobHistoryForm.value;
      urlEndPoint = 'add-job-history';
    }

    if (subFormType === 'job-history') {
      jobHistoryData.startingDate = this.formatDate(
        jobHistoryData.startingDate
      );
      jobHistoryData.endingDate = this.formatDate(jobHistoryData.endingDate);
      jobHistoryData.witStartDate = this.formatDate(
        jobHistoryData.witStartDate
      );
      jobHistoryData.witEndDate = this.formatDate(jobHistoryData.witEndDate);
    }

    console.log(formData)

    this.userProfileService
      .postSubFormData(
        urlEndPoint,
        this.dataService.generateFormDataObj(formData)
      )
      .subscribe({
        next: (res: any) => {
          const { appEmployee, ...rest } = res;
          this.processingSubFormData(urlEndPoint, rest);
          this.toastr.success(`${subFormType} data added successfully`);
          localStorage.removeItem('profileData');
        },
        error: () =>
          this.toastr.error(
            `Data you are passing in the ${subFormType} form is invalid, please add valid data`
          ),
      });
  }

  deleteSubFormData(...args: any) {
    const [subFormDataList, subFormType, subFormDataId] = args;

    let endPoint = '';

    if (subFormType === 'education')
      endPoint = `profile/delete-education?userEduId=${subFormDataId}&employeeId=${this.profileHelperData.personnelNo}`;
    else if (subFormType === 'children')
      endPoint = `profile/delete-child?userChildId=${subFormDataId}&employeeId=${this.profileHelperData.personnelNo}`;
    else if (subFormType === 'spouse')
      endPoint = `profile/delete-spouse?userSpouseId=${subFormDataId}&employeeId=${this.profileHelperData.personnelNo}`;
    else if (subFormType === 'job-history')
      endPoint = `profile/delete-job-history?userJobHistoryId=${subFormDataId}&employeeId=${this.profileHelperData.personnelNo}`;

    this.userProfileService.deleteSubFormData(endPoint).subscribe({
      next: () => {
        this.toastr.success(`${subFormType} record successfully deleted`);
        localStorage.removeItem('profileData');
      },
      error: () => this.toastr.error('Someting went wrong'),
    });
  }

  editSubFormData(...args: any) {
    const [subFormDataList, subFormType, subFormDataId, subForm] = args;
    const filteredData = subFormDataList.filter(
      (data: any) =>
        data.eduId === subFormDataId ||
        data.childId === subFormDataId ||
        data.spouseId === subFormDataId ||
        data.jobHistoryId === subFormDataId
    );

    this.subFormEditData = [
      {
        subFormDataId: subFormDataId,
        editedData: subForm,
        subFormDataList: subFormDataList,
        subFormType: subFormType,
      },
    ];

    console.log(filteredData, args);

    if (subFormType === 'education') {
      const { degree, passingYear, grade, totalMarks, obtainingMarks } =
        filteredData[0];
      this.myProfileEducationForm.setValue({
        degree,
        passingYear,
        grade,
        totalMarks,
        obtainingMarks,
      });
    } else if (subFormType === 'children') {
      const { name, dob, education, gender } = filteredData[0];
      this.myProfileFamilyForm.setValue({
        name,
        fatherName: '',
        dob,
        education,
        gender,
      });
    } else if (subFormType === 'spouse') {
      const { name, dob, education, fatherName } = filteredData[0];
      this.myProfileFamilyForm.setValue({
        name,
        fatherName,
        dob,
        education,
        gender: '',
      });
    } else if (subFormType === 'job-history') {
      const {
        startTime: startingDate,
        endTime: endingDate,
        department,
        prevDesignation,
        prevSalary,
        wit,
        witStartTime: witStartDate,
        witEndTime: witEndDate,
      } = filteredData[0];
      this.myProfileJobHistoryForm.setValue({
        startingDate,
        endingDate,
        department,
        prevDesignation,
        prevSalary,
        wit,
        witStartDate,
        witEndDate,
      });
    }

    this.isAllowEdit = true;
  }

  deleteAccount(user: any) {
    user.subscribe({
      next: (res: any) =>
        this.userProfileService
          .deleteEmployeeAccount(res.personnelNo)
          .subscribe({
            next: () => {
              this.toastr.success(
                `Account of employee with Personnel No. ${res.personnelNo} successfully deleted`
              );
              localStorage.removeItem('profileData');
              setTimeout(() => this.router.navigateByUrl('/'), 2000);
            },
            error: (subErr: any) => {
              let errMsg;
              if (subErr) errMsg = subErr.error;
              else
                errMsg = 'Unable to delete the account or Someting went wrong';
              this.toastr.error(errMsg);
            },
          }),
      error: (err: any) => this.toastr.error('Someting went wrong'),
    });
  }
}
