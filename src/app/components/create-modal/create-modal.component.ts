import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
  imports: [RouterModule, TranslateModule],
  styleUrls: ['./create-modal.component.scss'],
	template: `
    <div class="modal-header">
        <h4 class="modal-title" id="modal-title">{{ "CREATE_MODAL.SECRET_MESSAGE_CREATED" | translate }}</h4>
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
        <small><strong>{{ "CREATE_MODAL.LINK" | translate }}: </strong><a [href]="url" target="_blank">{{url}}</a></small>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-outline-danger" (click)="backMenu()" >{{ "CREATE_MODAL.MENU" | translate }}</button>
        <button type="button" class="btn btn-primary" (click)="this.action()">{{ "CREATE_MODAL.GO_CHALLENGE" | translate }}</button>
    </div>
    `,
})
export class CreateModalComponent {
	@Input() message: string | undefined;
  @Input() url: string | undefined;
  @Input() path: string | undefined;

	constructor(
    public modal: NgbActiveModal,
    private router: Router) {}

  backMenu(){
    this.modal.close();
    this.router.navigate(["/"]);
  }

  action(){
    this.router.navigateByUrl(this.path as string);
    this.modal.close();
  }
}
