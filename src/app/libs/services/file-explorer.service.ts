import { Injectable } from "@angular/core";
import { ApiService, CommonService } from ".";
import { fileExplorerStateMachine } from "./state-machines";
import { createActor } from "xstate";
import { Subject } from "rxjs";
import { IUserFile } from "../types";
import { IGlobalState } from "../store";
import { Store } from "@ngrx/store";
import { TFileExplorerActionParams } from "src/app/components/file-explorer/libs";

@Injectable({
  providedIn: 'root',
})
export class FileExplorerService {
  private fileExplorerActor: any;
  private fileDirListObs$: Subject<IUserFile[]> = new Subject();

  constructor(private store: Store<IGlobalState>, private apiService: ApiService, private commonService: CommonService) {
    this.fileExplorerActor = createActor(fileExplorerStateMachine, {
      input: {
        services: {
          apiService: this.apiService,
          commonService: this.commonService,
          store: this.store,
        },
      },
    }).start();

    this.fileExplorerActor.subscribe((snapshot: any) => {
      console.log('snapshot', snapshot);
    });
  }

  getList() {
    this.fileExplorerActor.send({ type: 'event_listing' });
  }

  create(dirName: string) {
    this.fileExplorerActor.send({ type: 'event_creating', params: { dirName } });
  }

  previewFile<T>(params: TFileExplorerActionParams, callback: () => Promise<T>) {
    this.fileExplorerActor.send({ type: 'event_previewing', params, callback });
  }
}