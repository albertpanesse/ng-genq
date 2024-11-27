import { Injectable } from "@angular/core";
import { ApiService, CommonService } from ".";
import { fileManagerStateMachine, IStateFileManagerContext } from "./state-machines";
import { createActor } from "xstate";
import { Subject } from "rxjs";
import { IUserFile } from "../types";
import { IGlobalState } from "./store";
import { Store } from "@ngrx/store";

@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  private fileManagerActor: any;
  private fileDirListObs$: Subject<IUserFile[]> = new Subject();

  constructor(private store: Store<IGlobalState>, private apiService: ApiService, private commonService: CommonService) {
    this.fileManagerActor = createActor(fileManagerStateMachine, {
      input: {
        services: {
          apiService: this.apiService,
          commonService: this.commonService,
          store: this.store,
        },
      },
    }).start();

    this.fileManagerActor.subscribe((snapshot: any) => {
      console.log('snapshot', snapshot);
    });
  }

  getList() {
    this.fileManagerActor.send({ type: 'event_listing' });
  }

  create(dirName: string) {
    this.fileManagerActor.send({ type: 'event_creating', params: { dirName } });
  }
}