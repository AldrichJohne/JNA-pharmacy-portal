import {Component, Inject, OnInit} from '@angular/core';
import {CashierService} from "../../services/cashier.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NotifPromptComponent} from "../notif-prompt/notif-prompt.component";

@Component({
  selector: 'app-delete-prompt-sale',
  templateUrl: './delete-prompt-sale.component.html',
  styleUrls: ['./delete-prompt-sale.component.scss']
})
export class DeletePromptSaleComponent implements OnInit {

  productName = '';
  notifyMessage = '';
  notifyStatus = '';

  constructor(
    private cashierService: CashierService,
    @Inject(MAT_DIALOG_DATA) public deleteData : any,
    private dialogRef : MatDialogRef<DeletePromptSaleComponent>,
    private dialog : MatDialog
  ) { }

  ngOnInit(): void {
    this.productName = this.deleteData.productName;
  }

  continueDelete() {
    return this.cashierService.deleteProductSoldRecord(this.deleteData.id)
      .subscribe({
        next: () => {
          this.notifyMessage = 'Product Deleted Successfully';
          this.notifyStatus = 'OK';
          this.OpenNotifyDialog();
          this.dialogRef.close()
        },
        error:()=>{
          this.notifyMessage = 'Error Deleting Product';
          this.notifyStatus = 'ERROR';
          this.OpenNotifyDialog();
          this.dialogRef.close()
        }
      })
  }

  OpenNotifyDialog() {
    this.dialog.open(NotifPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

}
