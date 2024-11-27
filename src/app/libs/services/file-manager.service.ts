import { Injectable } from "@angular/core";
import { ApiService, CommonService } from ".";
import { fileManagerStateMachine, IStateFileManagerContext } from "./state-machines";
import { createActor } from "xstate";
import { Subject } from "rxjs";
import { IUserFile } from "../types";

@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  private fileManagerActor: any;
  private fileDirListObs$: Subject<IUserFile[]> = new Subject();

  constructor(private apiService: ApiService, private commonService: CommonService) {
    const fileManagerMachineContext: IStateFileManagerContext = JSON.parse(localStorage.getItem('authMachineContext') as string);
    this.fileManagerActor = createActor(fileManagerStateMachine, {
      input: {
        services: {
          apiService: this.apiService,
          commonService: this.commonService,  
        },
        context: { ...fileManagerMachineContext },
      },
    }).start();

    this.fileManagerActor.subscribe((snapshot: any) => {
      console.log('snapshot', snapshot);
      localStorage.setItem('authMachineContext', JSON.stringify(snapshot.context.context));
    });
  }

  getList() {
    this.fileManagerActor.send({ type: 'event.listing' });
  }

  create(dirName: string) {
    this.fileManagerActor.send({ type: 'event.creating', params: { dirName } });
  }
}