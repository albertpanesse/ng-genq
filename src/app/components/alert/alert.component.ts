import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, signal } from "@angular/core";
import { ToastModule } from "@coreui/angular";
import { IAlert } from "src/app/libs/services";

@Component({
  selector: 'alert-comp',
  templateUrl: './alert.component.html',
  standalone: true,
  imports: [CommonModule, ToastModule],
})
export class AlertComponent implements OnInit {
  @Input() alerts: IAlert[] = [];

  visible = signal(true);

  ngOnInit(): void {
    // this.visible.update(value => !value);
  }
}
