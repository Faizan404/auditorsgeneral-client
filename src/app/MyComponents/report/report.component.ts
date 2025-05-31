import { Component, OnInit } from '@angular/core';
import { AuditformService } from 'src/app/services/audit/auditform.service';
import { DataService } from 'src/app/services/state/dataservice.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  public reportData: any = {};

  constructor(private auditService: AuditformService) {} // private dataService: DataService

  ngOnInit(): void {
    this.getReportDataFormStateManager();
  }

  getReportDataFormStateManager() {
    const data = localStorage.getItem('report');
    if (!data) return;
    this.reportData = JSON.parse(data);
    this.writeDataToFile(this.reportData);
  }

  writeDataToFile(rptData: Array<string>) {
    console.log(rptData);
    // this.auditService.writeArrayToFile(rptData).subscribe({
    //   next: (res) => console.log(res),
    //   error: (err) => console.error(err),
    // });
  }
}
