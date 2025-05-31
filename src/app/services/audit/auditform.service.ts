import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuditformService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //?                   ***** HOME *****
  getAllAvailableForms(empData: string) {
    return this.http.get(
      this.baseUrl + `auditform/available-forms?employeeNo=${empData}`
    );
  }
  getInitAuditForm(auditData: {
    auditParaNo: string;
    auditYear: number;
    employeeNo: string;
  }) {
    console.log(auditData);
    return this.http.post(this.baseUrl + 'auditform/init-form', auditData);
  }

  createAuditDetails(auditData: any) {
    return this.http.post(this.baseUrl + 'auditform/hr', auditData);
  }

  createAuditCases(auditData: any) {
    return this.http.post(this.baseUrl + 'auditform/hr-cases', auditData);
  }

  // getAuditData(queryPram: any) {
  //   return this.http.post(this.baseUrl + 'auditform/available-forms-data', queryPram);
  // }
  getAuditData(queryPram: any) {
    let urlString = this.baseUrl + `auditform/available-forms-data?`;

    if (queryPram.auditParaNo && queryPram.auditYear)
      urlString += `auditParaNo=${queryPram.auditParaNo}&auditYear=${queryPram.auditYear}`;
    else if (queryPram.auditYearStart && queryPram.auditYearEnd)
      urlString += `auditYearStart=${queryPram.auditYearStart}&auditYearEnd=${queryPram.auditYearEnd}`;
    else
      urlString += `auditYearStart=${
        queryPram.auditYearStart || queryPram.auditYearEnd
      }`;

    return this.http.get(urlString);
  }

  delParas(queryParam: { currentData: any; url: string }) {
    return this.http.delete(
      this.baseUrl +
        `auditform/${queryParam.url}?paraId=${queryParam.currentData}`
    );
  }

  delCases(queryParam: number) {
    return this.http.delete(
      this.baseUrl + `auditform/del-case?caseId=${queryParam}`
    );
  }
  editCase(queryParam: number, auditData: any) {
    return this.http.patch(
      this.baseUrl + `auditform/update-case?caseId=${queryParam}`,
      auditData
    );
  }

  //?             ***** GET *****
  getRequestHandler(endPoint: string) {
    return this.http.get(this.baseUrl + endPoint);
  }
  //?             ***** PATCH *****
  patchRequestHandler(endPoint: string, data: any) {
    return this.http.patch(this.baseUrl + endPoint, data);
  }
  //?             ***** POST *****
  postRequestHandler(endPoint: string, data: any) {
    return this.http.post(this.baseUrl + endPoint, data);
  }

  getAllParas(endPoint: string) {
    return this.getRequestHandler(endPoint);
  }

  editParas(auditData: any, param: any, endPoint: string) {
    return this.patchRequestHandler(
      `auditform/${endPoint}?paraId=${param}`,
      auditData
    );
  }

  editFormHr(auditData: any, endPoint: string) {
    // console.log(endPoint, auditData);
    return this.patchRequestHandler(endPoint, auditData);
  }

  createParas(endPoint: string, auditData: any) {
    // console.log(`URL: ${this.baseUrl}${endPoint}, DATA: ${JSON.stringify(auditData)}`);
    return this.http.post(this.baseUrl + endPoint, auditData);
  }

  // ? report
  writeArrayToFile(arrayData: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/writeToFile`, arrayData);
  }
}
