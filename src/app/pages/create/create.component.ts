import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateModalComponent } from 'src/app/components/create-modal/create-modal.component';
import { ShareCodeService } from 'src/app/services/share-code-service.service';
import { getRandomEncrypt, getRandomWord, normalizeText, randomizeArray } from 'src/app/utils/utils';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {

  msg?: string;
  originalCode?: string;
  hint?: string;
  code?: any;
  settings: any;
  
  uniqueChars: string[] = [];

  uniqueCharsSplitted: string[][] = [];

  charCount: any;

  constructor(
    private _shareCodeService: ShareCodeService,
    private modalService: NgbModal,
  ){
  }



  async onCreate(event: any){

    if(!this.msg) return null;

    this.settings = event;

    this.originalCode = getRandomEncrypt( this.msg );
    this.hint = getRandomWord( this.msg, event.hintAmount )?.toUpperCase();
    this.code = this.originalCode.split('').map((char) => ({char, res: '', selected: false}));

    this.autoCompleteHints();

    this.getCharCount();
    
    if(this.settings?.autoFillFrequent) this.replaceFrequentLetters(this.settings?.autoFillFrequent);
    if(this.settings?.autoFillRandom) this.replaceRandomLetters(this.settings?.autoFillRandom);

    const data = {
      quote: {normalizedText: normalizeText(this.msg), quote: this.msg, author: ''},
      settings: event,
      code: this.code,
      hint: this.hint || null,
      originalCode: this.originalCode,
      uniqueChars: this.uniqueChars,
      charCount: this.charCount
    }

    const res = await this._shareCodeService.create(data);
    const id = res.id;

    const modalRef = this.modalService.open(CreateModalComponent, { backdropClass: 'light-backdrop', centered: true });
    modalRef.componentInstance.message = this.msg;
    modalRef.componentInstance.url = window.document.body.baseURI + 'join/' + id;
    modalRef.componentInstance.path = '/join/' + id;

    return null;
    
  }

  autoCompleteHints(){
    if(this.settings?.autocompleteHint) this.completeLetters(this.hint?.split('') || []);
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

  }

  completeLetters(letters: string[]){
    for (const letter of letters) {
      if(this.msg){
        this.msg?.split("").forEach((l, i) => {
          if(l.toLocaleLowerCase() === letter.toLocaleLowerCase()){
            this.code[i].res = letter;
          }
        })
      }
    }
  }

  completeCharacters(characters: string[]){
    for (const char of characters) {
      if(this.msg){
        this.msg?.split("").forEach((l, i) => {
          if(this.code[i].char === char){
            this.code[i].res = l;
          }
        })
      }
    }
  }

  replaceFrequentLetters(amount: number){

    this.completeCharacters([...this.uniqueChars].slice(0, amount));

  }

  replaceRandomLetters(amount: number){

    const uniqueCharsRandomized = randomizeArray([...this.uniqueChars]);

    this.completeCharacters(uniqueCharsRandomized.slice(0, amount));

  }


  autogrow(){
    const textArea = document.getElementById("textarea");
    if(textArea){
      textArea.style.overflow = 'hidden';
      textArea.style.height = '5.5rem';
      textArea.style.height = textArea.scrollHeight + 'px';
    }
  }

}
