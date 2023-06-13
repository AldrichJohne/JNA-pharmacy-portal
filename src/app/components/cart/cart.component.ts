import {Component, Inject, OnInit} from '@angular/core';
import {CashierService} from "../../services/cashier.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {SharedEventService} from "../../services/shared-event.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotifPromptComponent} from "../prompts/notif-prompt/notif-prompt.component";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartForm!: FormGroup;
  productsOnCart: any;
  displayedColumns: string[] = ['productId', 'name', 'class', 'price', 'srp', 'quantity', 'isDiscounted', 'pharmacist', 'transactionDate', 'actions'];
  dataSource = new MatTableDataSource(this.cartData);
  totalPrice = 0;
  payment = 0;
  change = 0;
  notifyMessage = '';
  notifyStatus = '';

  constructor(private formBuilder : FormBuilder,
              private cashierService: CashierService,
              @Inject(MAT_DIALOG_DATA) public cartData : any,
              private dialogRef : MatDialogRef<CartComponent>,
              private dialog : MatDialog,
              public shareEventService: SharedEventService) { }

  ngOnInit(): void {
    this.cartForm = this.formBuilder.group({
      payment:['',Validators.required]
    })

    this.productsOnCart = this.cartData;
    this.totalPrice = this.shareEventService.cartTotalSrp;
  }

  openNotifyDialog() {
    this.dialog.open(NotifPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

  confirmClose(){
    this.dialogRef.close();
  }

  clearField() {
    this.cartForm.reset();
    this.payment = 0;
    this.change = 0;
  }

  confirmPayment() {
    if (this.cartForm.controls['payment'].value < this.totalPrice) {
      this.notifyMessage = 'Payment should be higher or equals to total price';
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
      this.cartForm.reset();
    } else {
      this.payment = this.cartForm.controls['payment'].value;
      this.change = this.payment - this.totalPrice;
    }
  }

}
