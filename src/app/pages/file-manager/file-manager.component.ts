import { Component } from "@angular/core";
import { TreeviewModule } from "../../components/treeview/treeview.module";
import { TreeNode } from "../../components/treeview/treeview.types";
import { FileUploadModalComponent, ModalComponent } from "../../components/modals";
import { DialogModalService } from "../../lib/services/dialog-modal.service";
import { EActionType } from "../../lib/types";

const treeNodes: TreeNode[] = [
  {
    id: '1001',
    name: 'Test Dank Satu',
    isFolder: true,
    children: [
      {
        id: '1101',
        name: 'File Satu',
        isFolder: false,
      },
      {
        id: '1102',
        name: 'File Dua',
        isFolder: false,
      },
    ],
  },
  {
    id: '1002',
    name: 'Test Dank Dua',
    isFolder: true,
    children: [],
  },
];

@Component({
  selector: 'file-manager-comp',
  templateUrl: './file-manager.component.html',
  imports: [TreeviewModule],
  standalone: true,
})
export class FileManagerComponent {
  actionType = EActionType;
  treeNodes = treeNodes;

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
