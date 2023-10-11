import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AuthorData } from 'src/app/interfaces/author-data.model';
import { GetAuthorService } from 'src/app/services/get-author.service';

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  styleUrls: ['./complete-modal.component.scss'],
	template: `
    <div class="modal-header">
        <h4 class="modal-title" id="modal-title">{{ "COMPLETE_MODAL.CONGRATS" | translate }}</h4>
        <button
            type="button"
            class="btn-close"
            aria-describedby="modal-title"
            (click)="modal.dismiss('Cross click')"
        ></button>
    </div>
    <div class="modal-body">
        <img class="rounded mx-auto d-block mb-1" [src]="authorData?.thumbnail?.source" width="25%"  />
        <figure class="mb-1 text-center">
          <blockquote class="blockquote mb-0">
            <p class="mb-0">“{{message}}”<p>
          </blockquote>
          <figcaption class="blockquote-footer mt-1">
            <a *ngIf="authorData?.title; else template" [href]="'https://en.wikipedia.org/wiki/' + authorData?.title" target="_blank">{{author}}</a>
            <ng-template #template>{{author}}</ng-template>
          </figcaption>
        </figure>

        <small><strong>{{ "COMPLETE_MODAL.LINK" | translate }}: </strong><a [href]="locationUrl" target="_blank">{{locationUrl}}</a></small>
        <br />
        <small><strong>{{ "COMPLETE_MODAL.TIME" | translate }}: </strong>{{hours}} {{ (hours === 1 ? "COMPLETE_MODAL.HOUR" : "COMPLETE_MODAL.HOURS") | translate }} {{minutes}} {{ (minutes === 1 ? "COMPLETE_MODAL.MINUTE" : "COMPLETE_MODAL.MINUTES") | translate }} {{seconds}} {{ (seconds === 1 ? "COMPLETE_MODAL.SECOND" : "COMPLETE_MODAL.SECONDS") | translate }}</small>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-outline-danger" (click)="backMenu()" >{{ "COMPLETE_MODAL.MENU" | translate }}</button>
        <button type="button" class="btn btn-primary" (click)="this.action()">{{ "COMPLETE_MODAL.NEXT_CHALLENGE" | translate }}</button>
    </div>
    `,
})
export class CompleteModalComponent {
	@Input() message: string | undefined;
  @Input() author: string | undefined;
  @Input() seconds: number | undefined;
  @Input() minutes: number | undefined;
  @Input() hours: number | undefined;
  @Input() action: any;

  authorData?: AuthorData;


  get locationUrl(){
    return window.location.href;
  }

	constructor(
    public modal: NgbActiveModal,
    private router: Router,
    private getAuthorService: GetAuthorService) {}

  ngOnInit(){
    if(this.author) this.getAuthorService.getAuthor(this.author).subscribe(data => {
      this.authorData = data;
      data.thumbnail.source
    })
  }

  backMenu(){
    this.modal.close();
    this.router.navigate(["/"]);
  }
}
