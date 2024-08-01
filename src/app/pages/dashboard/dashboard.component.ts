import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'dashboard-comp',
  templateUrl: './dashboard.component.html',
  imports: [RouterModule],
  standalone: true,
})
export class DashboardComponent {}
