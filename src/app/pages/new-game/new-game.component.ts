import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faGear, faGamepad, faQuestionCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setSettings } from 'src/app/store/actions/settings.actions';
import { SettingState } from 'src/app/store/reducers/settings.reducer';
import { Router } from '@angular/router';
import { getRandomTextIndex } from 'src/app/utils/utils';
import { difficulties, DIFFICULTIES, difficultyHelpMessages } from 'src/app/utils/difficulty';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent {

  @Input() create: boolean = false;
  @Output() onCreate: EventEmitter<any> = new EventEmitter();

  private redirectTo?: string;

  public isCollapsed = true;
  defaultDifficulty: DIFFICULTIES.normal = DIFFICULTIES.normal;

  formGroup: FormGroup;
  settings: FormGroup;

  settings$: Observable<SettingState>;
  settingsState?: SettingState;

  faGear = faGear;
  faGamepad = faGamepad;
  faQuestionCircle = faQuestionCircle;
  faPlus = faPlus;
  

  get helpText () {
    if(this.formGroup?.value?.difficulty){
      return (difficultyHelpMessages)[this.formGroup?.value?.difficulty as keyof typeof difficultyHelpMessages]
    } else {
      return 'Select a difficulty to play a game!'
    }
    
  }

  constructor(
    private _fb: FormBuilder,
    private store: Store<{ settings: SettingState }>,
    private router: Router
  ){


    const data = this.router.getCurrentNavigation()?.extras.state;
    if(data && data['url']){
      this.redirectTo = data['url'].replace(window.document.baseURI, '');
    }


    this.formGroup = this._fb.group({
      difficulty: ['normal', Validators.required]
    });

    this.settings = this._fb.group({
      autoFillFrequent: [0, Validators.required],
      autoFillRandom: [0, Validators.required],
      showHint: [false, Validators.required],
      autocompleteHint: [false, Validators.required],
      hintAmount: [3, Validators.required],
      showFrequencyOfCharacters: [false, Validators.required],
      showFrecuencyOfLetters: [false, Validators.required],
      showFrecuencyOfTwoLetters: [false, Validators.required],
      showFrecuencyOfThreeLetters: [false, Validators.required],
    });

    

    this.settings.reset(difficulties[this.defaultDifficulty]);

    this.settings.get('showHint')?.valueChanges.subscribe(value => {
      if(!value){
        this.settings.get('autocompleteHint')?.disable();
        this.settings.get('hintAmount')?.disable();
      } else {
        this.settings.get('autocompleteHint')?.enable();
        this.settings.get('hintAmount')?.enable();
      }
    });

    this.formGroup.get('difficulty')?.valueChanges.subscribe(
    (value: DIFFICULTIES) => {
      if(value === 'custom'){
        return this.settings.reset(this.settingsState);
      }
      this.settings.reset(difficulties[value]);
    });

    this.settings$ = this.store.select((state) => state.settings)
    this.settings$.subscribe(value => {
      this.settingsState = value;
      if(value.initialized){
        this.formGroup.get('difficulty')?.setValue(DIFFICULTIES.custom);
      }
    });

  }

  start(){
    this.store.dispatch(setSettings(this.settings.value));
    if(this.redirectTo){
      this.router.navigateByUrl(this.redirectTo);
    } else {
      this.router.navigate(['play', getRandomTextIndex(this.settings.value?.hintAmount)]);
    }
  }

  emitCreate(){
    this.onCreate?.emit(this.settings.value);
  }

  


}
