import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  baseUrl: string = environment.apiUrl;
  empPersonalOrJobData: any = {};

  constructor(private http: HttpClient) {}

  handlerPostRequests(endPoint: string, data: any) {
    return this.http.post(this.baseUrl + endPoint, data);
  }

  handlerGetRequests(endPoint: string, empId: string) {
    return this.http.get(`${this.baseUrl + endPoint}?empId=${empId}`);
  }

  handlerUpdateRequests(endPoint: string, data: any) {
    return this.http.patch(this.baseUrl + endPoint, data);
  }

  getProfileData(data: string) {
    return this.handlerGetRequests('profile/user-profile-data', data);
  }

  addNewEducation(eduData: {
    degree: string;
    passingYear: number;
    grade: string;
    totalMarks: number;
    obtainingMarks: number;
    eduType: string;
    employeeNo: string;
  }) {
    const { employeeNo: employeeId, ...rest } = eduData;
    return this.handlerPostRequests('profile/add-education', {
      ...rest,
      employeeId,
    });
  }

  helperProfileData(dataFlag: any, dataObj: any) {
    console.log(dataFlag, dataObj, '🥺🥺');

    if (dataFlag)
      return this.handlerUpdateRequests('profile/update-job', dataObj);
    else return this.handlerPostRequests('profile/add-job-details', dataObj);
  }

  updateProfileData(formType: string, employeeData: any) {
    console.log(formType, employeeData);
    let obser: Observable<any> = of(null);
    if (formType === 'personal') {
      obser = this.handlerUpdateRequests(
        'profile/update-profile',
        employeeData
      );
    } else if (formType === 'job') {
      const {
        email,
        name,
        isActive,
        personnelNo: employeeId,
        ...rest
      } = employeeData;

      this.empPersonalOrJobData = { ...rest, employeeId };

      obser = this.handlerGetRequests(
        `profile/job-data-exists`,
        employeeData.personnelNo
      );
    }

    return obser;
  }

  postSubFormData(endPoint: string, data: any) {
    const { employeeNo: employeeId, ...rest } = data;
    data = { ...rest, employeeId };
    console.log(endPoint, data);
    return this.handlerPostRequests(`profile/${endPoint}`, data);
  }

  updateSubFormData(endPoint: string, data: any) {
    console.log(endPoint, data);
    return this.handlerUpdateRequests(endPoint, data);
  }

  deleteSubFormData(endPoint: string) {
    return this.http.delete(this.baseUrl + endPoint);
  }

  deleteEmployeeAccount(empId: string) {
    return this.handlerUpdateRequests(
      `profile/make-user-inactive?empId=${empId}`,
      null
    );
  }
}
