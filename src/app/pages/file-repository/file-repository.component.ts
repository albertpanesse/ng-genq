import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { FileManagerService } from "src/app/libs/services";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IUserFile } from "src/app/libs/types";
import { FileExplorerComponent } from "src/app/components/file-explorer/file-explorer.component";
import { ITreeItem } from "src/app/components/file-explorer/libs";
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

  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private fileManagerService: FileManagerService, private store: Store<IGlobalState>) {}

  ngOnInit(): void {
    this.fileManagerService.getList();

    this.store.select(fileDirListSelector)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((fileDirList: IUserFile[]) => {
        this.items = transformUserFilesToTree(fileDirList);
      });
  }
}