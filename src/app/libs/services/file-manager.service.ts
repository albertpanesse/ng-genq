import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { CommonUIService } from "./common-ui.service";
import { fileManagerStateMachine, IStateFileManagerContext } from "./state-machines";
import { createActor } from "xstate";

@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  private fileManagerActor: any;

  constructor(private apiService: ApiService, private commonUIService: CommonUIService) {
    const fileManagerMachineContext: IStateFileManagerContext = JSON.parse(localStorage.getItem('authMachineContext') as string);
    this.fileManagerActor = createActor(fileManagerStateMachine, {
      input: {
        services: {
          apiService: this.apiService,
          commonUIService: this.commonUIService,  
        },
        context: { ...fileManagerMachineContext },
      },
    }).start();

    this.fileManagerActor.subscribe((snapshot: any) => {
      console.log('snapshot', snapshot);
      localStorage.setItem('authMachineContext', JSON.stringify(snapshot.context.context));
    });
  }
}