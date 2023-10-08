import { Component } from '@angular/core';
import { faGear, faAdd, faGamepad } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  faGear = faGear;
  faAdd = faAdd;
  faGamepad = faGamepad;

  ngOnInit(){

    const body = window.document.body;
    body.style.height = '100vh';
    body.style.overflow = 'hidden';

  }

  ngOnDestroy(){
    const body = window.document.body;
    body.style.height = 'initial';
    body.style.overflow = 'initial';
  }

}
