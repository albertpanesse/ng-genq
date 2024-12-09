import { Injectable } from "@angular/core";
import { Action, Selector, Store } from "@ngrx/store";

import { IGlobalState } from "./store";
import { Observable } from "rxjs";
import { fileDirListSelector, isUserLoggedInSelector, tokensSelector } from "./store/selectors";
import { IUserFile } from "../types";

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  
  constructor(private store: Store<IGlobalState>) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  subscribe(selector: Selector<T, V>, subscribeFunction: (value: any) => any, errorFunction?: (error: any) => void) {
    return this.store.select(selector).subscribe({
      next: subscribeFunction,
      error: errorFunction
    });
  }
}