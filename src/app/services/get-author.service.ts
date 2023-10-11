import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { AuthorData } from '../interfaces/author-data.model';

@Injectable({
  providedIn: 'root'
})
export class GetAuthorService {

  constructor(
    private http: HttpClient
  ) { }

  getAuthor(author: string){
    return this.http.get(`https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&generator=prefixsearch&gpssearch=${author.replace(new RegExp(' ', 'g'), '+')}&gpsnamespace=0&gpslimit=10&prop=pageimages%7Cinfo%7Cextracts%7Ccategories&piprop=thumbnail&pithumbsize=320&pilimit=10&list=prefixsearch&pssearch=Francisco+de+Goya&pslimit=10&inprop=watchers&format=json&rawcontinue=&redirects=1&exintro=true&exsentences=2&explaintext=true&exlimit=10&cllimit=10&clcategories=undefined`)
      .pipe(map<any, AuthorData>((data: any) => {
        if(data?.query.pages){
          const key = Object.keys(data?.query.pages)
          return data?.query.pages[key[0]]
        }
      }));
  }
}
