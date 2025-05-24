import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonCloseDirective, ButtonDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective } from "@coreui/angular";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'create-dir-dialog-comp',
  templateUrl: 'create-dir-dialog.component.html',
  styleUrls: ['create-dir-dialog.component.scss'],
  standalone: true,
  imports: [
    ButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ThemeDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    TranslateModule,
    FormsModule,
  ],
})
export class CreateDirDialogComponent implements OnInit {
  @Input() visible = false;

  @Output() saved = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  dirName: string = '';

  constructor() {}
  
  ngOnInit(): void {
    this.dirName = '';
  }

  save() {
    this.saved.emit(this.dirName.trim());
    this.close();
  }

  close() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    this.dirName = '';

    this.visible = false;
    this.closed.emit();
  }
}