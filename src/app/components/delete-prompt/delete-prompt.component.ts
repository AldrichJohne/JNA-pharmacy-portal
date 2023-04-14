import {Component, Inject, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NotifPromptComponent} from "../notif-prompt/notif-prompt.component";

@Component({
  selector: 'app-delete-prompt',
  templateUrl: './delete-prompt.component.html',
  styleUrls: ['./delete-prompt.component.scss']
})
export class DeletePromptComponent implements OnInit {
  productName = '';
  notifyMessage = '';
  notifyStatus = '';

  constructor(private productService: ProductService,
              @Inject(MAT_DIALOG_DATA) public deleteData : any,
              private dialogRef : MatDialogRef<DeletePromptComponent>,
              private dialog : MatDialog) { }

  ngOnInit(): void {
    this.productName = this.deleteData.name;
  }

  continueDelete() {
    return this.productService.deleteProduct(this.deleteData.id)
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
