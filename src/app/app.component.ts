import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { delay, filter, map, tap } from 'rxjs/operators';

import { ColorMode, ColorModeService } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { AlertComponent, ChatWidgetComponent, LoaderComponent } from "./components";
import { CommonService, IAlert } from "./libs/services";
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { IGlobalState } from './libs/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AlertComponent, LoaderComponent, ChatWidgetComponent],
})
export class AppComponent implements OnInit {
  title = 'GenQ - General Query';
  alerts: IAlert[] = [];
  showLoader: boolean = true;

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #titleService = inject(Title);

  readonly #colorModeService = inject(ColorModeService);
  readonly #iconSetService = inject(IconSetService);

  constructor(private commonService: CommonService, private store: Store<IGlobalState>, private translate: TranslateService) {
    this.#titleService.setTitle(this.title);
    // iconSet singleton
    this.#iconSetService.icons = { ...iconSubset };
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');

    this.translate.addLangs(['en', 'id', 'ar', 'fr']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');

    this.commonService.getLoaderSubject()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((show) => {
        this.showLoader = show as boolean;
      });
  }

  ngOnInit(): void {
    this.commonService.getAlertSubject()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((alerts) => {
        const typedAlerts = alerts as IAlert[];
        if (typedAlerts && typedAlerts.length > 0) {
          console.log('alerts', typedAlerts);
          this.alerts = typedAlerts;
        }
      });

    this.#router.events
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
      });

    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map((params: any) => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter((theme: any) => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          this.#colorModeService.colorMode.set(theme as ColorMode);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }
}
