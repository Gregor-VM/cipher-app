import { Component, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faRefresh, faForward } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
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
import Quote from 'src/app/interfaces/quote.model';
import { AppSettingState } from 'src/app/store/reducers/app-settings.reducer';
import { setAppSettings } from 'src/app/store/actions/app-settings.actions';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent {

  settings$: Observable<SettingState>;
  settings?: SettingState;

  appSettings$: Observable<AppSettingState>;
  appSettingsState?: AppSettingState;

  active = 1;

  created?: boolean;

  private message?: string;
  private quote?: Quote;
  private originalCode?: string;
  private startTime?: number;
  private endTime?: number;
  public hint?: string | null;

  private mouseX = 0;
  private mouseY = 0;

  code: Char[] = [];

  keySelected: Char | null = null;

  uniqueChars: string[] = [];

  uniqueCharsSplitted: string[][] = [];

  charCount: any;

  faRefresh = faRefresh;
  faForward = faForward;

  frequentTwo = ['de', 'la', 'el', 'en', 'se', 'un', 'no', 'su', 'es', 'al', 'lo', 'le', 'ha']
  frequentThree = ['que', 'los', 'del', 'las', 'por', 'con', 'una', 'mas', 'sus']

  showingWarning = false;
  warningTimeout: NodeJS.Timeout | null = null;

  @ViewChildren('pop') popOver?: QueryList<NgbPopover>;

  showTutorial = false;

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
    private store: Store<{ settings: SettingState, appSettings: AppSettingState }>,
    private _sharedCodeService: ShareCodeService,
    private translateService: TranslateService
    ){

    this.unSelectListener();
    this.replaceLetterListener();

    this.appSettings$ = this.store.select((state) => state.appSettings);
    this.appSettings$.subscribe(value => {
      this.appSettingsState = value;
    });

    this.settings$ = this.store.select((state) => state.settings)
    this.settings$.subscribe(value => {
      this.settings = value;

      if(!this.settings.initialized) {
        this.router.navigate(['new-game'], { state: {url: window.location.href} });
      }

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

    const input = window.document.getElementById('keyboard');

    if(input){
      document.addEventListener("mousemove", function(event) {
        const mouseY = event.pageY;
        input.style.top = mouseY + "px";
      });
    }

    if(this.showTutorial){
      setTimeout(() => {

        if(this.popOver?.get(1)){
          this.popOver.get(1)?.open({
            title: this.translateService.instant('PLAY.TUTORIAL_TITLE_FIRST'),
            description: this.translateService.instant('PLAY.TUTORIAL_DESCRIPTION_FIRST')});
        }
        
      }, 800)
    }
    
  }

  async loadCreatedCode(id: string){

    this.showTutorial = false;

    const doc = await this._sharedCodeService.get(id);
    const data = (doc.data() as SharedCode);

    this.quote = {quote: data.quote.quote, normalizedText: data.quote.normalizedText, author: data.quote.author};

    this.message = data.quote.normalizedText;
    this.originalCode = data.originalCode;
    this.hint = data.hint;
    this.code = data.code;

    this.settings = data.settings;

    this.getCharCount();
    
    this.startTime = (new Date()).getTime();

  }

  loadCode(id: string | number){
    this.quote = getText(Number(id));

    this.showTutorial = this.appSettingsState?.showTutorial || false;

    if(this.showTutorial){
      this.quote = {
        author: '',
        quote: 'Debes completar este mensaje',
        normalizedText: 'Debes completar este mensaje'
      }
    }

    this.message = this.quote.normalizedText;
    this.originalCode = getRandomEncrypt( this.message );
    this.hint = getRandomWord( this.message, this.settings?.hintAmount )?.toUpperCase();
    this.code = this.originalCode.split('').map((char) => ({char, res: '', selected: false, warning: false}));

    if(this.showTutorial){
      this.completeLetters(this.quote.normalizedText.split("").filter(e => e !== 'e'));
    }

    this.getCharCount();

    if(!this.showTutorial){
      this.autoCompleteHints();    
      if(this.settings?.autoFillFrequent) this.replaceFrequentLetters(this.settings?.autoFillFrequent);
      if(this.settings?.autoFillRandom) this.replaceRandomLetters(this.settings?.autoFillRandom);
    }

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

    if(this.showTutorial){
      this.popOver?.get(1)?.close();
      setTimeout(() => {
        this.popOver?.get(1)?.open({
          title: this.translateService.instant('PLAY.TUTORIAL_TITLE_SECOND'),
          description: this.translateService.instant('PLAY.TUTORIAL_DESCRIPTION_SECOND')
        });
      }, 500)
    }

    const input = window.document.getElementById('keyboard');
    input?.focus();

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

  markWarning(letter: string){

    if(this.showingWarning){

      if(this.warningTimeout) clearTimeout(this.warningTimeout)

      for (const char of this.code) {
        char.warning = false;
        this.showingWarning = false;
      }

    }

    this.showingWarning = true;

    for (const char of this.code) {
      if(char.res.toLowerCase() === letter){
        char.warning = true;
      } else {
        char.warning = false;
      }
    }

    this.warningTimeout = setTimeout(() => {
      for (const char of this.code) {
        char.warning = false;
        this.showingWarning = false;
      }
    }, 1000);

  }

  replaceLetterListener(){
    window.addEventListener('keydown', (e) => {

      if(e.key.toLowerCase() === this.keySelected?.res) return;

      if(this.keySelected && e.code === 'Backspace'){
        this.replaceLetter('');
      }

      const usedWords = Array.from(new Set(this.code.map(letter => letter.res.toLowerCase())));

      if(usedWords.includes(e.key.toLowerCase())){
        this.markWarning(e.key.toLowerCase())
        return;
      }

      if(this.keySelected && allowedKeys.includes(e.key.toLowerCase())){
        this.replaceLetter(e.key.toLowerCase());

        if(this.isComplete){
          this.onComplete();
        }
      }

    })
  }

  handleMobileTyping(e: Event){

    const input = e.target as HTMLInputElement;

    if(input){
      const key = input?.value.toLowerCase();
      if(allowedKeys.includes(key)){
        this.replaceLetter(key);
        input?.blur();
        this.unSelectAll();
        if(this.isComplete){
          this.onComplete();
        }
      }
      input.value = '';
    }

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
    
    if(this.showTutorial && this.appSettingsState) {
      this.popOver?.get(1)?.close();
      this.store.dispatch(setAppSettings({...this.appSettingsState, showTutorial: false}));
    }

    if(this.appSettingsState?.showConfetti) this.showConffetti();
    setTimeout(this.openBackDropCustomClass.bind(this), 500);
  }

  openBackDropCustomClass() {

    this.endTime = (new Date()).getTime();

    const difference = this.endTime - (this.startTime as number);
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

		const modalRef = this.modalService.open(CompleteModalComponent, { backdropClass: 'light-backdrop', centered: true });
    modalRef.componentInstance.message = this.quote?.quote;
    modalRef.componentInstance.author = this.quote?.author;

    modalRef.componentInstance.minutes = Math.floor(minutes);
    modalRef.componentInstance.seconds = Math.floor(seconds);
    modalRef.componentInstance.hours = Math.floor(hours);
    modalRef.componentInstance.action = () => {
      modalRef.close();
      this.skipGame();
    }
	}

}
