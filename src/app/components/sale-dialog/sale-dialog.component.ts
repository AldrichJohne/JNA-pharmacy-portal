import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import * as moment from 'moment';
import {CashierService} from "../../services/cashier.service";
import {NotifPromptComponent} from "../prompts/notif-prompt/notif-prompt.component";
import {SharedEventService} from "../../services/shared-event.service";

@Component({
  selector: 'app-sale-dialog',
  templateUrl: './sale-dialog.component.html',
  styleUrls: ['./sale-dialog.component.scss']
})
export class SaleDialogComponent implements OnInit {

  productSaleForm!: FormGroup;
  productSaleFormTitle: string = "SELL"
  currentDate = new Date();
  disableSellButton = false;
  notifyStatus = '';
  notifyMessage = '';
  pharmacistOnDuty = '';
  productToCart: any[] = [];

  constructor(private formBuilder : FormBuilder,
              private cashierService: CashierService,
              @Inject(MAT_DIALOG_DATA) public saleData : any,
              private dialogRef : MatDialogRef<SaleDialogComponent>,
              private dialog : MatDialog,
              public shareEventService: SharedEventService) { }

  ngOnInit(): void {
    this.shareEventService.pharmacistGlobal$.subscribe(value =>{
      this.pharmacistOnDuty = value;
    });
    this.productSaleForm = this.formBuilder.group({
      classification:['',Validators.required],
      productName:['',Validators.required],
      price:['',Validators.required],
      srp:['',Validators.required],
      soldQuantity:['',Validators.required],
      transactionDateTemp:['',Validators.required],
      transactionDate:[''],
      isDiscounted:['',Validators.required],
      productId:['', Validators.required],
      pharmacist:['', Validators.required]
    })
    this.readyFields();
  }

  sellBatchProduct() {
    if (this.productSaleForm.controls['soldQuantity'].value > +this.saleData.remainingStock) {
      this.notifyMessage = 'You cannot sell more than what is remaining';
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
      this.productSaleForm.reset();
      this.dialogRef.close();
    } else {
      if (this.productSaleForm.controls['pharmacist'].value == "" || this.productSaleForm.controls['soldQuantity'].value == "") {
        this.notifyMessage = 'Missing required field/s';
        this.notifyStatus = 'ERROR';
        this.openNotifyDialog();
        this.productSaleForm.reset();
        this.dialogRef.close();
      } else {
        this.enableRequiredAdditionalFields();
        this.productSaleForm.controls['productId'].setValue(this.saleData.id);
        const convertedTransactionDate = moment(this.productSaleForm.value.transactionDateTemp).format('YYYY-MM-DD');
        this.productSaleForm.patchValue({ transactionDate: convertedTransactionDate });
        this.productSaleForm.controls['transactionDateTemp'].disable();

        // this.shareEventService.addNewItemToCart.next(this.productSaleForm.value);
        this.shareEventService.addItemToCart(this.productSaleForm.value);
        this.notifyMessage = 'Product Added To Cart Success';
        this.notifyStatus = 'OK';
        this.openNotifyDialog()
        this.productSaleForm.reset();
        this.dialogRef.close('sale');
      }
    }
  }

  sellProduct() {
    if (this.productSaleForm.controls['soldQuantity'].value > +this.saleData.remainingStock) {
      this.notifyMessage = 'You cannot sell more than what is remaining';
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
      this.productSaleForm.reset();
      this.dialogRef.close();
    } else {
      if (this.productSaleForm.controls['pharmacist'].value == "" || this.productSaleForm.controls['soldQuantity'].value == "") {
        this.notifyMessage = 'Missing required field/s';
        this.notifyStatus = 'ERROR';
        this.openNotifyDialog();
        this.productSaleForm.reset();
        this.dialogRef.close();
      } else {
        this.enableRequiredAdditionalFields();
        this.productSaleForm.controls['productId'].setValue(this.saleData.id);
        const convertedTransactionDate = moment(this.productSaleForm.value.transactionDateTemp).format('YYYY-MM-DD');
        const isDiscounted = this.productSaleForm.controls['isDiscounted'].value;
        this.productSaleForm.patchValue({ transactionDate: convertedTransactionDate });
        this.productSaleForm.controls['transactionDateTemp'].disable();

        this.cashierService.productSale(
          this.productSaleForm.value,
          this.saleData.id,
          isDiscounted)
          .subscribe({
            next:()=>{
              this.notifyMessage = 'Product Sell Success';
              this.notifyStatus = 'OK';
              this.openNotifyDialog()
              this.productSaleForm.reset();
              this.dialogRef.close('sale');
            },
            error:()=>{
              this.notifyMessage = 'Error On Product Sell';
              this.notifyStatus = 'ERROR';
              this.openNotifyDialog();
              this.readyFields();
              this.productSaleForm.controls['transactionDateTemp'].enable();
              this.productSaleForm.controls['discountSwitch'].enable();
            }
          })
      }
    }
  }

  private readyFields() {
    if (this.saleData.plainClassificationDto.name !== 'generics') {
      this.productSaleForm.controls['isDiscounted'].setValue(false);
      this.productSaleForm.controls['isDiscounted'].disable();
    }
    if (this.saleData.remainingStock <= 0) {
      this.productSaleFormTitle = 'THIS PRODUCT IS OUT OF STOCK'
      this.disableSellButton = true;
      this.productSaleForm.controls['soldQuantity'].disable();
      this.productSaleForm.controls['transactionDateTemp'].disable();
    }
    this.productSaleForm.controls['classification'].disable();
    this.productSaleForm.controls['productName'].disable();
    this.productSaleForm.controls['price'].disable();
    this.productSaleForm.controls['srp'].disable();
    this.productSaleForm.controls['classification'].setValue(this.saleData.plainClassificationDto.name);
    this.productSaleForm.controls['productName'].setValue(this.saleData.name);
    this.productSaleForm.controls['price'].setValue(this.saleData.pricePerPc);
    this.productSaleForm.controls['srp'].setValue(this.saleData.srpPerPc);
    this.productSaleForm.controls['transactionDateTemp'].setValue(this.currentDate);
    this.productSaleForm.controls['transactionDate'].disable();
    this.productSaleForm.controls['isDiscounted'].setValue(false);
    this.productSaleForm.controls['productId'].disable();
    this.productSaleForm.controls['pharmacist'].setValue(this.pharmacistOnDuty);
  }

  private enableRequiredAdditionalFields() {
    this.productSaleForm.controls['transactionDate'].enable();
    this.productSaleForm.controls['classification'].enable();
    this.productSaleForm.controls['productName'].enable();
    this.productSaleForm.controls['price'].enable();
    this.productSaleForm.controls['srp'].enable();
    this.productSaleForm.controls['isDiscounted'].enable();
    this.productSaleForm.controls['productId'].enable();

  }

  openNotifyDialog() {
    this.dialog.open(NotifPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }
}
