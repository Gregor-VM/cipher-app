import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SettingState } from 'src/app/store/reducers/settings.reducer';
import { getPhrasesSize, getRandomTextIndex } from 'src/app/utils/utils';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  codeNumber: string | null = null;

  settings$: Observable<SettingState>;
  settings?: SettingState;


  formGroup: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<{ settings: SettingState }>,){
      this.formGroup = this.fb.group({
        codeNumber: ['', []]
      });

      this.settings$ = this.store.select((state) => state.settings)
      this.settings$.subscribe(value => this.settings = value);
  }

  searchCode() {
    if(this.settings?.initialized){
      const index = parseInt(this.formGroup.value.codeNumber);
      if(index >= 0 && index < getPhrasesSize()) this.router.navigate(['play', this.formGroup.value.codeNumber]);
    } else {
      this.router.navigate(['new-game']);
    }
    
  }

}
