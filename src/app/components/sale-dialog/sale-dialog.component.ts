import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import {CashierService} from "../../services/cashier.service";

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

  constructor(private formBuilder : FormBuilder,
              private cashierService: CashierService,
              @Inject(MAT_DIALOG_DATA) public saleData : any,
              private dialogRef : MatDialogRef<SaleDialogComponent>) { }

  ngOnInit(): void {
    this.productSaleForm = this.formBuilder.group({
      classification:['',Validators.required],
      productName:['',Validators.required],
      price:['',Validators.required],
      srp:['',Validators.required],
      soldQuantity:['',Validators.required],
      transactionDateTemp:['',Validators.required],
      transactionDate:[''],
      discountSwitch:['',Validators.required]
    })
    this.readyFields();
  }

  sellProduct() {
    if (this.productSaleForm.controls['soldQuantity'].value > +this.saleData.remainingStock) {
      alert('You cannot sell more that what is remaining');
      this.productSaleForm.reset();
      this.dialogRef.close();
    } else {
      console.log(this.productSaleForm.controls['soldQuantity'].value)
      console.log(this.saleData.remainingStock)
      this.enableRequiredFields();
      const convertedTransactionDate = moment(this.productSaleForm.value.transactionDateTemp).format('YYYY-MM-DD');
      const discountSwitch = this.productSaleForm.controls['discountSwitch'].value;
      this.productSaleForm.patchValue({ transactionDate: convertedTransactionDate });
      this.productSaleForm.controls['transactionDateTemp'].disable();
      this.productSaleForm.controls['discountSwitch'].disable();

      this.cashierService.productSale(
        this.productSaleForm.value,
        this.saleData.id,
        discountSwitch)
        .subscribe({
          next:()=>{
            alert("Product Sell Success!");
            this.productSaleForm.reset();
            this.dialogRef.close('sale');
          },
          error:()=>{
            alert("You must fill out required fields");
            this.readyFields();
            this.productSaleForm.controls['transactionDateTemp'].enable();
            this.productSaleForm.controls['discountSwitch'].enable();

          }
        })
    }
  }

  private readyFields() {
    if (this.saleData.plainClassificationDto.name !== 'generics') {
      this.productSaleForm.controls['discountSwitch'].setValue(false);
      this.productSaleForm.controls['discountSwitch'].disable();
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
    this.productSaleForm.controls['discountSwitch'].setValue(false);
  }

  private enableRequiredFields() {
    this.productSaleForm.controls['transactionDate'].enable();
    this.productSaleForm.controls['classification'].enable();
    this.productSaleForm.controls['productName'].enable();
    this.productSaleForm.controls['price'].enable();
    this.productSaleForm.controls['srp'].enable();
    this.productSaleForm.controls['discountSwitch'].enable();
  }

}
