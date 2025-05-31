import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  handlerGetRequest(endPoint: string) {
    return this.http.get(this.baseUrl + endPoint);
  }

  getAllTabData(tab: string) {
    const endPoint = tab === 'users' ? 'admin/get-users' : 'admin/get-forms';
    return this.handlerGetRequest(endPoint);
  }

  getQueryData(tab: string, query: string) {
    const endPoint =
      tab === 'users'
        ? `admin/filter-users?search=${query}`
        : `admin/filter-forms?search=${query}`;
    return this.handlerGetRequest(endPoint);
  }

  deleteAccount(recId: string, requestFor: string) {
    let endPoint = '';

    requestFor === 'personnelNo'
      ? (endPoint = `admin/delete-account?employeeId=${recId}`)
      : (endPoint = `admin/delete-form?formId=${recId}`);

    return this.http.delete(this.baseUrl + endPoint);
  }
}
