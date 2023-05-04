import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SharedEventService} from "../../../services/shared-event.service";

@Component({
  selector: 'app-add-batch-products-confirmation-prompts',
  templateUrl: './add-batch-products-confirmation-prompts.component.html',
  styleUrls: ['./add-batch-products-confirmation-prompts.component.scss']
})
export class AddBatchProductsConfirmationPromptsComponent implements OnInit {

  message = '';
  triggeredBy = '';
  okButtonColor = 'warn';

  constructor(@Inject(MAT_DIALOG_DATA) public data : any,
              public shareEventService: SharedEventService,
              private dialogRef : MatDialogRef<AddBatchProductsConfirmationPromptsComponent>) { }

  ngOnInit(): void {
    this.message = this.data.message;
    this.triggeredBy = this.data.triggeredBy;
    if(this.data.triggeredBy == 'SAVE-BUTTON') {
      this.okButtonColor = 'primary';
    }
  }

  closePrompt() {
    this.dialogRef.close();
  }

  proceed() {
    this.shareEventService.batchAddButtonTrigger.next(this.triggeredBy);
    this.message = '';
    this.triggeredBy = '';
    this.closePrompt();
  }

}
