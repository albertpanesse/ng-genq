import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ButtonCloseDirective, ButtonDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective } from "@coreui/angular";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'create-dir-dialog-comp',
  templateUrl: 'create-dir-dialog.component.html',
  styleUrls: ['create-dir-dialog.component.scss'],
  standalone: true,
  imports: [ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent, TranslateModule],
})
export class CreateDirDialogComponent {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.visible = false;
    this.closed.emit();
  }
}