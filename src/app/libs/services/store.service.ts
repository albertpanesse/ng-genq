import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import { IGlobalState } from "./store";
import { Observable } from "rxjs";
import { fileDirListSelector, isUserLoggedInSelector, tokensSelector } from "./store/selectors";
import { IUserFile } from "../types";

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  
  constructor(private store: Store<IGlobalState>) {}

  getIsUserLoggedInState(): Observable<boolean> {
    return this.store.select(isUserLoggedInSelector);
  }

  getFileDirListState(): Observable<IUserFile[]> {
    return this.store.select(fileDirListSelector);
  }
}