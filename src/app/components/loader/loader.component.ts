import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalBodyComponent, ModalComponent } from '@coreui/angular';

@Component({
  selector: 'loader-comp',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: true,
  imports: [CommonModule, ModalBodyComponent, ModalComponent],
})
export class LoaderComponent {
  @Input() showLoader: boolean = false;
}
