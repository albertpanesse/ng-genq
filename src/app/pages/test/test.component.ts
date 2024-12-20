import { Component, OnInit } from "@angular/core";
import { CommonService } from "../../libs/services";
import { EchartComponent } from "../../components/echart/echart.component";

@Component({
  selector: 'test-comp',
  templateUrl: 'test.component.html',
  styleUrls: ['test.component.scss'],
  standalone: true,
  imports: [EchartComponent],
})
export class TestComponent implements OnInit {
  
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.commonService.setLoader(false);
  }
}