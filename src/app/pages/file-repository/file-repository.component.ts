import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { transformUserFilesToTree } from "../../components/file-explorer/libs/transformer";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { IGlobalState } from "../../libs/store";
import { FileExplorerService } from "../../libs/services";
import { fileContentSelector, fileDirListSelector } from "../../libs/store/selectors";
import { IUserFile } from "../../libs/types";
import { FileExplorerComponent } from "../../components/file-explorer/file-explorer.component";
import { EFileExplorerActions, ITreeItem, TFileExplorerActionParams, TFileExplorerActionResult } from "../../components/file-explorer/libs";

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