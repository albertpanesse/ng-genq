import { Component, OnInit } from "@angular/core";
import { CommonService } from "../../libs/services";

@Component({
  selector: 'dashboard-comp',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
})
export class DashboardComponent implements OnInit {

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.commonService.setLoader(false);
  }
}
