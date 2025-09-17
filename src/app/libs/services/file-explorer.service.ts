import { Injectable } from "@angular/core";
import { ApiService, CommonService } from ".";
import { fileExplorerStateMachine } from "./state-machines";
import { createActor } from "xstate";
import { Subject } from "rxjs";
import { IUserFile } from "../types";
import { IGlobalState } from "../store";
import { Store } from "@ngrx/store";
import { TFileExplorerActionParams } from "../../components/file-explorer/libs";
import { ICreateDirDTO, IFileDirListDTO, IPreviewFileDTO, IUploadFileDTO } from "../dtos";

@Injectable({
  providedIn: 'root',
})
export class FileExplorerService {
  private fileExplorerActor = createActor(fileExplorerStateMachine, {
    input: { services: {} as any },
  });
  private fileDirListObs$ = new Subject<IUserFile[]>();

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

  getList(fileDirListDTO: IFileDirListDTO) {
    this.fileExplorerActor.send({ type: 'event_listing', params: fileDirListDTO });
  }

  create(createDirDTO: ICreateDirDTO) {
    this.fileExplorerActor.send({ type: 'event_creating', params: createDirDTO });
  }

  uploadFile(uploadFileDTO: IUploadFileDTO) {
    this.fileExplorerActor.send({ type: 'event_uploading', params: uploadFileDTO });
  }

  previewFile(previewFileDTO: IPreviewFileDTO) {
    this.fileExplorerActor.send({ type: 'event_previewing', params: previewFileDTO });
  }
}
