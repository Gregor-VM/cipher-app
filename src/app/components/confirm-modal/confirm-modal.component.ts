import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
    imports: [TranslateModule],
	template: `
    <div class="modal-header">
        <h4 class="modal-title" id="modal-title">{{title}}</h4>
        <button
            type="button"
            class="btn-close"
            aria-describedby="modal-title"
            (click)="modal.dismiss('Cross click')"
        ></button>
    </div>
    <div class="modal-body">
        <p>{{description}}</p>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">{{ "CONFIRM_MODAL.CANCEL" | translate }}</button>
        <button type="button" class="btn btn-danger" (click)="this.action()">{{ "CONFIRM_MODAL.OK" | translate }}</button>
    </div>
    `,
})
export class NgbdModalContent {
	@Input() title: string | undefined;
    @Input() description: string | undefined;
    @Input() action: any;

	constructor(public modal: NgbActiveModal) {}
}