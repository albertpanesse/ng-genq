import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  ButtonCloseDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective
} from '@coreui/angular';
import { MonacoEditorModule } from "@materia-ui/ngx-monaco-editor";

import { ITreeItem } from "../../libs";

@Component({
  selector: 'file-viewer-modal-comp',
  templateUrl: 'file-viewer-modal.component.html',
  styleUrls: ['file-viewer-modal.component.scss'],
  standalone: true,
  imports: [
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ThemeDirective,
    MonacoEditorModule,
  ],
})
export class FileViewerModalComponent {
  @Input() fileContent: string = '';
  @Input() visible: boolean = false;

  @Output() onVisibleChange: EventEmitter<boolean> = new EventEmitter();

  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    automaticLayout: true,
  }

  handlerOnVisibleChange = (visible: boolean) => {
    this.onVisibleChange.emit(visible);
  }
}