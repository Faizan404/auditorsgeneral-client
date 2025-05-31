import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuditformService } from 'src/app/services/audit/auditform.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/state/dataservice.service';

@Component({
  selector: 'app-filter-hr',
  templateUrl: './filter-hr.component.html',
  styleUrls: ['./filter-hr.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FilterHrComponent implements OnInit {
  details: any = {};
  drafts: any = [];
  dacs: any = [];
  pacs: any = [];
  cases: any = [];

  auditsDetailsData: any = [];
  auditsDraftsData: any = [];
  auditsDacsData: any = [];
  auditsPacsData: any = [];
  auditsCasesData: any = [];

  // filterCheckboxesValues: any = {};
  reportHtmlArray: Array<string> = [];
  draftHtml: Array<string> = [];

  reportHtml: string = '';

  filterDataObj: any = {};
  //?               ******** REPORT FIELDS ********
  paraNo: string = '';
  yearAudit: number = 0;
  ministerFederal: string = '';
  officer: string = '';
  auditChairperson: string = '';
  //?                    ******** INFOS ********
  auditPara: string = '';
  auditReply: string = '';
  auditComments: string = '';
  criteria: string = '';
  formation: string = '';
  //?                   ******** DRAFTS ********
  draftDataPreserver: Array<{
    index: string;
    paraNo: string;
    para: string;
    paraSubj: string;
  }> = [];
  //?                     ******** DACS ********
  dacDataPreserver: Array<{
    index: string;
    dacDate: string;
    dacPara: string;
    dacCompliance: string;
  }> = [];
  //?                     ******** PACS ********
  pacDataPreserver: Array<{
    index: string;
    pacDate: string;
    pacPara: string;
    pacCompliance: string;
  }> = [];

  myFilterForm: FormGroup = new FormGroup({});
  myCheckbox: FormGroup = new FormGroup({});
  yearRange: any = [];

  constructor(
    private fb: FormBuilder,
    private auditService: AuditformService,
    public dataService: DataService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializingFilterForm();
    // this.initializingCheckbox();
    this.dataService.populateUpdateFileld();
  }

  initializingFilterForm() {
    this.myFilterForm = this.fb.group({
      // auditParaNo: ['', Validators.required],
      auditParaAndYear: [''],
      auditYearStart: [''],
      auditYearEnd: [''],
    });
  }

  settingReportTemplate(data: {
    auditParaNo: string;
    auditYear: number;
    federalMinister: string;
    chairperson: string;
    auditOfficer: string;
  }) {
    this.paraNo = data.auditParaNo;
    this.yearAudit = data.auditYear;
    this.officer = data.auditOfficer;
    this.auditChairperson = data.chairperson;
    this.ministerFederal = data.federalMinister;
  }

  generateKeys(data: any) {
    return Object.keys(data);
  }

  settingFilterChecks(filterType: string, data: any) {
    if (filterType === 'auditDetails') {
      const {
        federalMinister,
        chairperson,
        auditYear,
        auditParaNo,
        auditOfficer,
        ...restFields
      } = data;
      this.details = this.generateKeys(restFields);
    } else {
      if (!data) return;
      const { auditYear, ...rest } = data;
      if (filterType === 'auditParas') this.drafts = this.generateKeys(rest);
      else if (filterType === 'auditDacs') this.dacs = this.generateKeys(rest);
      else if (filterType === 'auditPacs') this.pacs = this.generateKeys(rest);
    }
  }

  displayingAuditCommentsDynamically(indexClass: string, e: any, data: any) {
    let commentMarkup = '';
    data
      .split('\n')
      .forEach((comment: string) => (commentMarkup += `<li>${comment}</li>`));
    const html = `
      <div class="${indexClass}">
        <h3>${e.target.checked ? 'Audit Comments :' : ''}</h3>
        <ul>
          ${e.target.checked ? commentMarkup : ''}
        </ul>
      </div>
    `;
    this.renderHTMLTemplate(indexClass, html);
  }

  displayingAuditExtrasDynamically(...args: any) {
    console.log(args);

    let [key, value, event, indexClass] = args;
    let fieldTitle = '';

    if (key === 'statusOfRecovery') fieldTitle = 'Status Of Recovery :';
    else if (key === 'statusOfAuditPara')
      fieldTitle = 'Status Of Audit Para  :';
    else if (key === 'dateOfAuditReportFinalization') {
      fieldTitle = 'Date Of Audit Report Finalization :';
      value = value.slice(0, 10).replaceAll('-', '.');
    } else if (key === 'dateOfIssuanceOfAuditObservation') {
      fieldTitle = 'Date Of Issuance Of Audit Observation :';
      value = value.slice(0, 10).replaceAll('-', '.');
    }

    const html = `
    <div class="row mb-3 ${indexClass}">
      <div class="col key">${event.target.checked ? fieldTitle : ''}</div>
      <div class="col value">${event.target.checked ? value : ''}</div>
    </div>
    `;

    this.renderHTMLTemplate(indexClass, html);
  }

  displayingAuditInfosDynamically(...args: any) {
    const [key, value, event, indexClass] = args;
    let sectionHeading = '';

    if (key === 'auditPara') sectionHeading = 'Brief of Para :';
    else if (key === 'departmentReply') sectionHeading = 'Department Reply :';
    else if (key === 'formation') sectionHeading = 'Audit Formation :';
    else if (key === 'criteria') sectionHeading = 'Audit Criteria :';
    else if (key === 'auditComments') sectionHeading = 'Audit Comments :';

    const html = `
      <div class="${indexClass}" style="font-family: 'Times New Roman', Times, serif;">
        <h3 style="font-family: inherit;text-decoration: underline;font-size: 1.4rem;font-weight: 600;">${
          event.target.checked ? sectionHeading : ''
        }</h3>
        <p style="font-family: inherit;text-align: justify;font-size: 1.2rem;">${
          event.target.checked ? value : ''
        }</p>
      </div>
    `;

    this.renderHTMLTemplate(indexClass, html);
  }

  displayingContentDynamically(...args: any) {
    console.log(args);

    const [indexClass, clickEvent, data, dataArr] = args;
    let HTMLtemplate = '';
    const index = dataArr.findIndex((data: any) => data.index === indexClass);

    if (index === -1) this.filterDataObj = {};
    else if (!clickEvent.target.checked) this.filterDataObj = dataArr[index];
    else this.filterDataObj = dataArr[index];

    if (indexClass.includes('draft') || indexClass.includes('subjectOfPara'))
      HTMLtemplate = this.displayingDraftParasDynamically(
        data,
        clickEvent.target.checked,
        indexClass
      );
    else if (indexClass.toLowerCase().includes('dac'))
      HTMLtemplate = this.displayingDacsDynamically(
        data,
        clickEvent.target.checked,
        indexClass
      );
    else if (indexClass.toLowerCase().includes('pac'))
      HTMLtemplate = this.displayingPacsDynamically(
        data,
        clickEvent.target.checked,
        indexClass
      );

    if (index === -1)
      dataArr.push({
        ...this.filterDataObj,
        index: indexClass,
      });
    else
      dataArr[index] = {
        ...this.filterDataObj,
        index: indexClass,
      };
    this.renderHTMLTemplate(indexClass, HTMLtemplate);
  }

  displayingDraftParasDynamically(...args: any) {
    const [[key, value], isChecked, indexClass] = args;

    if (key === 'draftParaNo')
      this.filterDataObj.paraNo = isChecked ? 'DP#' + value : '';
    else if (key === 'subjectOfPara')
      this.filterDataObj.paraSubj = isChecked ? value : '';
    else if (key === 'draftPara')
      this.filterDataObj.para = isChecked ? value : '';

    const html = `
      <div class="${indexClass}">
        <h3>${this.filterDataObj.paraNo ?? ''}</h3>
        <h3>${this.filterDataObj.paraSubj ?? ''}</h3>
        <p>${this.filterDataObj.para ?? ''}</p>
      </div>
    `;
    return html;
  }

  displayingDacsDynamically(...args: any) {
    const [[key, value], isChecked, indexClass] = args;

    if (key === 'dacDecisionDate')
      this.filterDataObj.dacDate = isChecked
        ? 'DAC Directives dated ' +
          value.replaceAll('-', '.').slice(1, 10) +
          ' :'
        : '';
    else if (key === 'dacDirectives')
      this.filterDataObj.dacPara = isChecked ? value : '';
    else if (key === 'complianceOfDACDirectives')
      this.filterDataObj.dacCompliance = isChecked ? value : '';

    const html = `
      <div class="${indexClass}">
        <h3>${this.filterDataObj.dacDate ?? ''}</h3>
        <p>${this.filterDataObj.dacPara ?? ''}</p>
        <h3 class="${
          this.filterDataObj.dacCompliance ? '' : 'hidden'
        }">Compliance Of DAC Directives</h3>
        <p>${this.filterDataObj.dacCompliance ?? ''}</p>
      </div>
    `;

    return html;
  }

  displayingPacsDynamically(...args: any) {
    const [[key, value], isChecked, indexClass] = args;

    if (key === 'pacDecisionDate')
      this.filterDataObj.pacDate = isChecked
        ? 'PAC Directives dated ' +
          value.replaceAll('-', '.').slice(1, 10) +
          ' :'
        : '';
    else if (key === 'pacDirectives')
      this.filterDataObj.pacPara = isChecked ? value : '';
    else if (key === 'complianceOfPACDirectives')
      this.filterDataObj.pacCompliance = isChecked ? value : '';

    const html = `
      <div class="${indexClass}">
        <h3>${this.filterDataObj.pacDate ?? ''}</h3>
        <p>${this.filterDataObj.pacPara ?? ''}</p>
        <h3 class="${
          this.filterDataObj.pacCompliance ? '' : 'hidden'
        }">Compliance Of DAC Directives</h3>
        <p>${this.filterDataObj.pacCompliance ?? ''}</p>
      </div>
    `;

    return html;
  }

  makeEntriesOfObject(data: any, arrData: any) {
    arrData.push(Object.entries(data));
  }
  isNotIncluded(key: string): boolean {
    if (
      [
        'auditOfficer',
        'chairperson',
        'auditYear',
        'federalMinister',
        'auditParaNo',
      ].includes(key)
    )
      return false;
    else return true;
  }

  getFilteredData() {
    const { auditParaAndYear, auditYearStart, auditYearEnd } =
      this.myFilterForm.value;

    let objectToSend = {};

    if (
      (auditParaAndYear && (auditYearStart || auditYearEnd)) ||
      (!auditParaAndYear && !auditYearStart && !auditYearEnd)
    )
      return alert('Invalid Operation');

    if (auditParaAndYear) objectToSend = JSON.parse(auditParaAndYear);
    else objectToSend = { auditYearStart, auditYearEnd };

    this.auditService.getAuditData(objectToSend).subscribe({
      next: (res: any) => {
        localStorage.setItem('formData', JSON.stringify(res));

        const { auditDetails, auditCases, auditPacs, auditDacs, auditParas } =
          res;

        this.auditsDetailsData = [...auditDetails];
        this.auditsDraftsData = [...auditParas];
        console.log(this.auditsDraftsData);
        this.auditsDacsData = [...auditDacs];
        this.auditsPacsData = [...auditPacs];
        this.auditsCasesData = [...auditCases];

        const extractYears = this.auditsDetailsData.map(
          (ad: { auditYear: any }) => ad.auditYear
        );
        this.yearRange = [...new Set(extractYears)];

        Object.entries({
          auditDetails: auditDetails[0],
          auditPacs: auditPacs[0],
          auditDacs: auditDacs[0],
          auditParas: auditParas[0],
        }).forEach(([key, value]): any => this.settingFilterChecks(key, value));
      },
      error: (err) => {
        this.toastr.error(err.error);
        console.error(err);
      },
    });
  }

  renderHTMLTemplate(indexedClass: string, HTMLtemplate: string) {
    const templateIndex = this.reportHtmlArray.findIndex(
      (temp: string): boolean => temp.includes(indexedClass)
    );
    if (templateIndex === -1) this.reportHtmlArray.push(HTMLtemplate);
    else {
      this.reportHtmlArray.splice(templateIndex, 1);
      this.reportHtmlArray.push(HTMLtemplate);
    }
    this.reportHtml = this.reportHtmlArray.join('');
  }

  saveReportData() {
    localStorage.setItem('report', JSON.stringify(this.reportHtmlArray));
  }
}
