import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { getPhrasesSize, getRandomTextIndex, getText, LangKey } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  get currentLang(){
        return (this._translateService.currentLang || this._translateService.defaultLang) as LangKey;
  }

  constructor(private _translateService: TranslateService) {}

  getPhrasesSize(){
    return getPhrasesSize( this.currentLang );
  }

  getText(index: number | null){
    return getText( this.currentLang, index );
  }

  getRandomTextIndex(hintAmount?: number){
    return getRandomTextIndex( this.currentLang, hintAmount );
  }

  
}
