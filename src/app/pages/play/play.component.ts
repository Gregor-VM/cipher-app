import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faRefresh, faForward } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NgbdModalContent } from 'src/app/components/confirm-modal/confirm-modal.component';
import Char from 'src/app/interfaces/char.model';
import { SettingState } from 'src/app/store/reducers/settings.reducer';
import { getRandomEncrypt, getRandomTextIndex, getRandomWord, getText, randomizeArray, removeAccents } from 'src/app/utils/utils';
import { allowedKeys, lettersByFrecuency } from 'src/app/utils/variables';
import * as confetti from 'canvas-confetti';
import { CompleteModalComponent } from 'src/app/components/complete-modal/complete-modal.component';
import { ShareCodeService } from 'src/app/services/share-code-service.service';
import { SharedCode } from 'src/app/interfaces/sharedCode.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent {

  settings$: Observable<SettingState>;
  settings?: SettingState;

  active = 1;

  created?: boolean;

  private message?: string;
  private originalCode?: string;
  private startTime?: number;
  private endTime?: number;
  public hint?: string | null;

  code: Char[] = [];

  keySelected: Char | null = null;

  uniqueChars: string[] = [];

  uniqueCharsSplitted: string[][] = [];

  charCount: any;

  faRefresh = faRefresh;
  faForward = faForward;

  frequentTwo = ['de', 'la', 'el', 'en', 'se', 'un', 'no', 'su', 'es', 'al', 'lo', 'le', 'ha']
  frequentThree = ['que', 'los', 'del', 'las', 'por', 'con', 'una', 'mas', 'sus']

  get frequentLetters() {

    let presentLetters = this.code.filter(char => char.res).map(char => char.res.toLocaleLowerCase());

    presentLetters = Array.from(new Set(presentLetters));

    return lettersByFrecuency.filter(letter => !presentLetters.includes(letter.toLowerCase()));
  }

  get isComplete(){
    if(this.message){
      const answer = removeAccents(this.message?.toLowerCase());
      const response = removeAccents(this.code.map(char => char.res || ' ').join("").toLowerCase());
      return answer === response;
    } else {
      return null;
    }
  }

  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<{ settings: SettingState }>,
    private _sharedCodeService: ShareCodeService,
    private translateService: TranslateService
    ){

    this.unSelectListener();
    this.replaceLetterListener();

    this.settings$ = this.store.select((state) => state.settings)
    this.settings$.subscribe(value => {
      this.settings = value;

      if(this.settings?.showFrecuencyOfThreeLetters) this.active = 3;
      if(this.settings?.showFrecuencyOfTwoLetters) this.active = 2;
      if(this.settings?.showFrecuencyOfLetters) this.active = 1;

      this.activatedRoute.params.subscribe(data => {
        const {created} = this.activatedRoute.snapshot.data;
        this.created = created;
        if(created) this.loadCreatedCode(data['id']);
        else this.loadCode(data['id']);
      })
      
    });
  }

  ngOnInit(){
    
  }

  async loadCreatedCode(id: string){

    const doc = await this._sharedCodeService.get(id);
    const data = (doc.data() as SharedCode);

    this.message = data.msg;
    this.originalCode = data.originalCode;
    this.hint = data.hint;
    this.code = data.code;

    this.settings = data.settings;

    this.getCharCount();
    
    this.startTime = (new Date()).getTime();

  }

  loadCode(id: string | number){
    this.message = getText(Number(id));
    this.originalCode = getRandomEncrypt( this.message );
    this.hint = getRandomWord( this.message, this.settings?.hintAmount )?.toUpperCase();
    this.code = this.originalCode.split('').map((char) => ({char, res: '', selected: false}));

    this.autoCompleteHints();

    this.getCharCount();
    
    if(this.settings?.autoFillFrequent) this.replaceFrequentLetters(this.settings?.autoFillFrequent);
    if(this.settings?.autoFillRandom) this.replaceRandomLetters(this.settings?.autoFillRandom);

    this.startTime = (new Date()).getTime();

  }

  completeLetters(letters: string[]){
    for (const letter of letters) {
      if(this.message){
        this.message?.split("").forEach((l, i) => {
          if(l.toLocaleLowerCase() === letter.toLocaleLowerCase()){
            this.code[i].res = letter;
          }
        })
      }
    }
  }

  completeCharacters(characters: string[]){
    for (const char of characters) {
      if(this.message){
        this.message?.split("").forEach((l, i) => {
          if(this.code[i].char === char){
            this.code[i].res = l;
          }
        })
      }
    }
  }

  select(selectedChar: Char){

    if ("virtualKeyboard" in navigator) {
      (navigator as any)?.virtualKeyboard?.show();
    }    

    for (const char of this.code) {
      if(char.char === selectedChar.char){
        this.keySelected = selectedChar;
        char.selected = true;
      } else {
        char.selected = false;
      }
    }
    
  }


  unSelectAll(){
    for (const char of this.code) {
      char.selected = false;
      this.keySelected = null;
    }

    if ("virtualKeyboard" in navigator) {
      (navigator as any)?.virtualKeyboard?.hide();
    }
  }

  replaceLetter(key: string){
    for (const char of this.code) {
      if(char.char === this.keySelected?.char){
        char.res = key;
      }
    }
  }

  resetLetters(){

    const modalRef = this.modalService.open(NgbdModalContent);
		modalRef.componentInstance.title = this.translateService.instant('CONFIRM_MODAL.RESET_LETTERS');
    modalRef.componentInstance.description = this.translateService.instant('CONFIRM_MODAL.RESET_LETTERS_DESCRIPTION');
    modalRef.componentInstance.action = () => {
      for (const char of this.code) {
        char.res = '';
        char.selected = false;
        this.keySelected = null;
        this.autoCompleteHints();
      }
      modalRef.close();
    }
  }

  getCharCount() {

    this.uniqueCharsSplitted = [];

    const uniqueChars = new Set(this.originalCode?.split(""));
    uniqueChars.delete(' ');
    const charCount: any = {};

    if(this.originalCode){
      for (const char of this.originalCode.split("")){
        if(charCount[char]) charCount[char] += 1;
        else charCount[char] = 1;
      }
    }

    this.charCount = charCount;
    this.uniqueChars = Array.from(uniqueChars).sort((a, b) => charCount[b] - charCount[a]);

    let uniqueCharsSplittedTemp = [];
    let index = 0;

    let symbolsPerRow = 14;

    if(window.innerWidth > 475 && window.innerWidth <= 1200) symbolsPerRow = 6;
    if(window.innerWidth <= 475) symbolsPerRow = 4;

    for (const char of this.uniqueChars) {
      if(index === symbolsPerRow){
        this.uniqueCharsSplitted.push(uniqueCharsSplittedTemp);
        uniqueCharsSplittedTemp = [];
        index = 0;
      }
      uniqueCharsSplittedTemp.push(char);
      index++;
    }

    if(index > 0) this.uniqueCharsSplitted.push(uniqueCharsSplittedTemp);

  }

  unSelectListener(){
    window.addEventListener('click', (e) => {
      if((e.target as HTMLElement).classList[0] === 'code-button') return;
      this.unSelectAll();
    })
  }

  replaceLetterListener(){
    window.addEventListener('keydown', (e) => {

      if(this.keySelected && e.code === 'Backspace'){
        this.replaceLetter('');
      }

      if(this.keySelected && allowedKeys.includes(e.key)){
        this.replaceLetter(e.key);
      }

      if(this.isComplete){
        this.onComplete();
      }
    })
  }

  skipGame(){
    this.router.navigate(['play', getRandomTextIndex(this.settings?.hintAmount)]);
  }

  showConffetti() {

    const myCanvas = (document.getElementById('confetti') as HTMLCanvasElement);
    
    const myConfetti = confetti.create(myCanvas, {
      resize: true,
      useWorker: true,
    });

    myConfetti({
      particleCount: 100,
      spread: 160,
    });
  }

  autoCompleteHints(){
    if(this.settings?.autocompleteHint) this.completeLetters(this.hint?.split('') || []);
  }

  replaceFrequentLetters(amount: number){

    this.completeCharacters(this.uniqueChars.slice(0, amount));

  }

  replaceRandomLetters(amount: number){

    const uniqueCharsRandomized = randomizeArray(this.uniqueChars);

    this.completeCharacters(uniqueCharsRandomized.slice(0, amount));

  }

  onComplete(){
    this.showConffetti();
    setTimeout(this.openBackDropCustomClass.bind(this), 500);
  }

  openBackDropCustomClass() {

    this.endTime = (new Date()).getTime();

    const difference = this.endTime - (this.startTime as number);
    const seconds = difference / (1000);
    const minutes = difference / (1000 * 60);
    const hours = difference / (1000 * 60 * 60);

		const modalRef = this.modalService.open(CompleteModalComponent, { backdropClass: 'light-backdrop', centered: true });
    modalRef.componentInstance.message = this.message;
    modalRef.componentInstance.minutes = Math.floor(minutes);
    modalRef.componentInstance.seconds = Math.floor(seconds);
    modalRef.componentInstance.hours = Math.floor(hours);
    modalRef.componentInstance.action = () => {
      modalRef.close();
      this.skipGame();
    }
	}

}
