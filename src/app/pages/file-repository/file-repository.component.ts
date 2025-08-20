import { Component, DestroyRef, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { EMPTY, filter, Observable, take } from "rxjs";
import { IFileDirList, IGlobalState } from "../../libs/store";
import { FileExplorerService } from "../../libs/services";
import { fileContentSelector, fileDirListSelector } from "../../libs/store/selectors";
import { FileExplorerComponent } from "../../components/file-explorer/file-explorer.component";
import { EFileExplorerActions, TFileExplorerActionParams, TFileExplorerActionResult } from "../../components/file-explorer/libs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IUserFile } from "../../libs/types";

@Component({
  selector: 'file-repository-comp',
  templateUrl: 'file-repository.component.html',
  styleUrls: ['file-repository.component.scss'],
  standalone: true,
  imports: [FileExplorerComponent],
})
export class FileRepositoryComponent {
  actions = new Map<EFileExplorerActions, (params: TFileExplorerActionParams) => Observable<TFileExplorerActionResult>>();

  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private fileExplorerService: FileExplorerService, private store: Store<IGlobalState>) {
    this.actions.set(
      EFileExplorerActions.FE_PREVIEWING,
      (params: TFileExplorerActionParams): Observable<string> => {
        this.fileExplorerService.previewFile(params);

        return this.store.select(fileContentSelector).pipe(takeUntilDestroyed(this.#destroyRef));
      }
    );

    this.actions.set(
      EFileExplorerActions.FE_LISTING,
      (params: TFileExplorerActionParams): Observable<IFileDirList> => {
        this.fileExplorerService.getList(params.userFileId);

        return this.store.select(fileDirListSelector).pipe(
          filter(data => !!data && data.userFiles.length > 0),
          take(1),
          takeUntilDestroyed(this.#destroyRef)
      );
      }
    );

    this.actions.set(
      EFileExplorerActions.FE_CREATING,
      (params: TFileExplorerActionParams): Observable<any> => {
        this.fileExplorerService.create(params as any);

        return this.store.select(fileDirListSelector).pipe(takeUntilDestroyed(this.#destroyRef));
      }
    );
  }
}