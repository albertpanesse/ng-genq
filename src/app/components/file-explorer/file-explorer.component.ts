import { Component, DestroyRef, inject, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { CommonModule } from '@angular/common';

import { cilArrowThickFromBottom } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { ButtonDirective } from '@coreui/angular';

import { DirectoryTreeComponent, FileBrowserComponent } from "./components";
import { EFileExplorerActions, ITreeItem, TFileExplorerActionParams, TFileExplorerActionResult } from "./libs/types";
import { filter, Observable, take } from "rxjs";
import { Store } from "@ngrx/store";
import { IFileDirList, IGlobalState } from "../../libs/store";
import { fileDirListSelector } from "../../libs/store/selectors";
import { IUserFile } from "../../libs/types";
import { transformUserFilesToTree } from "./libs/transformer";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'filetree-explorer-comp',
  templateUrl: 'file-explorer.component.html',
  styleUrls: ['file-explorer.component.scss'],
  standalone: true,
  imports: [ButtonDirective, CommonModule, DirectoryTreeComponent, FileBrowserComponent, IconDirective]
})
export class FileExplorerComponent implements OnInit {
  @Input() actions?: Map<EFileExplorerActions, (params: TFileExplorerActionParams) => Observable<TFileExplorerActionResult>>;

  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  icons = { cilArrowThickFromBottom };
  allItems: ITreeItem[] = [];
  currentItem: ITreeItem | null = null;

  constructor(private store: Store<IGlobalState>) {}

  ngOnInit() {
    const action = this.actions?.get(EFileExplorerActions.FE_LISTING);
    if (action) {
      action({ userFileId: -1 })
        .pipe(
          filter(files => (files as IFileDirList).userFiles.length > 0),
          take(1),
          takeUntilDestroyed(this.#destroyRef)
        )
        .subscribe((result: TFileExplorerActionResult) => {
          const userFiles = (result as IFileDirList).userFiles as IUserFile[];
          const dirFiles = transformUserFilesToTree(userFiles);
        });
    }
  }

  handlerOnDirectorySelected = (item: ITreeItem) => {
    this.currentItem = item;
  }
}