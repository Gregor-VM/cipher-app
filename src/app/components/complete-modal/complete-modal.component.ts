import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
  imports: [RouterModule, TranslateModule],
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
        <figure>
          <blockquote class="blockquote">
            <p class="mb-0">“{{message}}”<p>
          </blockquote>
        </figure>
        <small><strong>{{ "COMPLETE_MODAL.LINK" | translate }}: </strong><a [href]="locationUrl" target="_blank">{{locationUrl}}</a></small>
        <br />
        <small><strong>{{ "COMPLETE_MODAL.TIME" | translate }}: </strong>{{hours}} {{ "COMPLETE_MODAL.HOURS" | translate }} {{minutes}} {{ "COMPLETE_MODAL.MINUTES" | translate }} {{seconds}} {{ "COMPLETE_MODAL.SECONDS" | translate }}</small>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-outline-danger" (click)="backMenu()" >{{ "COMPLETE_MODAL.MENU" | translate }}</button>
        <button type="button" class="btn btn-primary" (click)="this.action()">{{ "COMPLETE_MODAL.NEXT_CHALLENGE" | translate }}</button>
    </div>
    `,
})
export class CompleteModalComponent {
	@Input() message: string | undefined;
  @Input() seconds: number | undefined;
  @Input() minutes: number | undefined;
  @Input() hours: number | undefined;
  @Input() action: any;


  get locationUrl(){
    return window.location.href;
  }

	constructor(
    public modal: NgbActiveModal,
    private router: Router) {}

  backMenu(){
    this.modal.close();
    this.router.navigate(["/"]);
  }
}
