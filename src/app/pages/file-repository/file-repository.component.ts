import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { FileExplorerService } from "src/app/libs/services";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IUserFile } from "src/app/libs/types";
import { FileExplorerComponent } from "src/app/components/file-explorer/file-explorer.component";
import { EFileExplorerActions, IFileExplorerActionPreviewParams, ITreeItem, TFileExplorerActionParams } from "src/app/components/file-explorer/libs";
import { transformUserFilesToTree } from "../../components/file-explorer/libs/transformer";
import { IGlobalState } from "src/app/libs/store";
import { Store } from "@ngrx/store";
import { fileDirListSelector } from "src/app/libs/store/selectors";

@Component({
  selector: 'file-repository-comp',
  templateUrl: 'file-repository.component.html',
  styleUrls: ['file-repository.component.scss'],
  standalone: true,
  imports: [FileExplorerComponent],
})
export class FileRepositoryComponent implements OnInit {
  items: ITreeItem[] = [];
  actions = new Map<EFileExplorerActions, <T>(params: TFileExplorerActionParams, callback: () => Promise<T>) => void>();

  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private fileExplorerService: FileExplorerService, private store: Store<IGlobalState>) {
    this.actions.set(
      EFileExplorerActions.FE_PREVIEW,
      <T>(params: TFileExplorerActionParams, callback: () => Promise<T>): void => {
        this.fileExplorerService.previewFile(params, callback);
      }
    )
  }

  ngOnInit(): void {
    this.fileExplorerService.getList();

    this.store.select(fileDirListSelector)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((fileDirList: IUserFile[]) => {
        this.items = transformUserFilesToTree(fileDirList);
      });
  }

  handlerFileExplorerPreviewCallback = () => {}
}