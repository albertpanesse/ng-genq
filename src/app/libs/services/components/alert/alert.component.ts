import { Component, Input, OnInit, signal } from "@angular/core";
import { ToastModule } from "@coreui/angular";

@Component({
  selector: 'alert-comp',
  templateUrl: './alert.component.html',
  standalone: true,
  imports: [ToastModule],
})
export class AlertComponent implements OnInit {
  title: string = 'Test';
  message: string = 'Test Doank Bro!';

  visible = signal(true);

  ngOnInit(): void {
    // this.visible.update(value => !value);
  }
}
