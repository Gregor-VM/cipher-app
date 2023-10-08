import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppSettingState } from 'src/app/store/reducers/app-settings.reducer';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { setAppSettings } from 'src/app/store/actions/app-settings.actions';
import { ToastService } from 'src/app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  appSettings: FormGroup;

  appSettings$: Observable<AppSettingState>;
  appSettingsState?: AppSettingState;

  faSave = faSave;

  constructor(
    private _fb: FormBuilder,
    private store: Store<{ appSettings: AppSettingState }>,
    private router: Router,
    private toastService: ToastService,
    private translateService: TranslateService
  ){

    this.appSettings = this._fb.group({
      showConfetti: [true, Validators.required],
      language: ['es', Validators.required],
    });

    this.appSettings$ = this.store.select((state) => state.appSettings);
    this.appSettings$.subscribe(value => {
      this.appSettingsState = value;
      this.appSettings.reset(value);
    });
  }

  saveChanges(){
    this.store.dispatch(setAppSettings(this.appSettings.value));

    this.translateService.use(this.appSettings.value.language);
    this.translateService.setDefaultLang(this.appSettings.value.language);

    window.localStorage.setItem('language', this.appSettings.value.language);

    this.toastService.show(this.translateService.instant('SETTINGS.SUCCESS_MESSAGE'), { classname: 'bg-success text-light mt-5', delay: 3000 });
    this.router.navigateByUrl('/');
  }



}
