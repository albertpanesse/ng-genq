import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import { IGlobalState } from "./store";
import { Observable } from "rxjs";
import { isUserLoggedInSelector, tokensSelector } from "./store/selectors";

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  
  constructor(private store: Store<IGlobalState>) {}

  getIsUserLoggedInState(): Observable<boolean> {
    return this.store.select(isUserLoggedInSelector);
  }
}