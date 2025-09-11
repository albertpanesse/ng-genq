import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, signal } from "@angular/core";
import { ToastModule } from "@coreui/angular";
import { IAlert } from "../../libs/services";

@Component({
  selector: 'alert-comp',
  templateUrl: './alert.component.html',
  standalone: true,
  imports: [CommonModule, ToastModule],
})
export class AlertComponent implements OnInit {
  @Input() alert!: IAlert;

  visible = signal(true);

  ngOnInit(): void {
    this.alert.triggered = !this.alert.triggered;
  }
}
