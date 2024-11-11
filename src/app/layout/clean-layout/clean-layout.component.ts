import { Component } from "@angular/core";
import { RouterOutlet } from '@angular/router';
import { ContainerComponent, ShadowOnScrollDirective } from "@coreui/angular";

@Component({
  templateUrl: 'clean-layout.component.html',
  styleUrls: ['clean-layout.component.scss'],
  standalone: true,
  imports: [ContainerComponent, RouterOutlet, ShadowOnScrollDirective],
})
export class CleanLayoutComponent {}