import { Component } from "@angular/core";
import { FileUploadModalComponent, ModalComponent } from "../../components/modals";
import { DialogModalService } from "../../libs/services/dialog-modal.service";
import { EActionType } from "../../libs/types";

@Component({
  selector: 'file-manager-comp',
  templateUrl: './file-manager.component.html',
  standalone: true,
})
export class FileManagerComponent {
  actionType = EActionType;

  constructor(private dialogModalService: DialogModalService) {}

  handlerOnAllAction = (actionType: EActionType) => {
    switch (actionType) {
      case EActionType.AT_FILE_UPLOAD:
        this.openModalWithCallback(FileUploadModalComponent, {
          onAction1: null,
          onAction2: null,
        });
        break;
    }
  }

  openModalWithCallback(
    modal: ModalComponent,
    callback: {
      onAction1: any,
      onAction2: any,
    },
  ) {
    const modalRef = this.dialogModalService.openModal(modal);
  }
}
