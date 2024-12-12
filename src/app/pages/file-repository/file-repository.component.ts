import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { FileExplorerService } from "src/app/libs/services";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IUserFile } from "src/app/libs/types";
import { FileExplorerComponent } from "src/app/components/file-explorer/file-explorer.component";
import { EFileExplorerActions, IFileExplorerActionPreviewParams, ITreeItem, TFileExplorerActionParams, TFileExplorerActionResult } from "src/app/components/file-explorer/libs";
import { transformUserFilesToTree } from "../../components/file-explorer/libs/transformer";
import { IGlobalState } from "src/app/libs/store";
import { Store } from "@ngrx/store";
import { fileContentSelector, fileDirListSelector } from "src/app/libs/store/selectors";
import { Observable } from "rxjs";

@Component({
  selector: 'file-repository-comp',
  templateUrl: 'file-repository.component.html',
  styleUrls: ['file-repository.component.scss'],
  standalone: true,
  imports: [FileExplorerComponent],
})
export class FileRepositoryComponent implements OnInit {
  items: ITreeItem[] = [];
  actions = new Map<EFileExplorerActions, (params: TFileExplorerActionParams) => Observable<TFileExplorerActionResult>>();

  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private fileExplorerService: FileExplorerService, private store: Store<IGlobalState>) {
    this.actions.set(
      EFileExplorerActions.FE_PREVIEW,
      (params: TFileExplorerActionParams): Observable<string> => {
        this.fileExplorerService.previewFile(params);

        return this.store.select(fileContentSelector);
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
}