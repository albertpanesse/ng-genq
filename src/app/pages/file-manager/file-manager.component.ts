import { Component } from "@angular/core";
import { TreeviewModule } from "../../components/treeview/treeview.module";
import { TreeNode } from "../../components/treeview/treeview.types";
import { FileUploadModalComponent, ModalComponent } from "../../components/modals";
import { DialogModalService } from "../../lib/services/dialog-modal.service";

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
  treeNodes = treeNodes;

  constructor(private dialogModalService: DialogModalService) {}

  handlerOnFileAdd = () => {
    this.allButtonActionWithModal(FileUploadModalComponent);
  }

  allButtonActionWithModal = (
    modal: ModalComponent
  ) => {
    const modalRef = this.dialogModalService.openModal(modal);
  }
}
