import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
      transactionDate:['']
    })

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
  }

  sellProduct() {
    this.productSaleForm.controls['transactionDate'].enable();
    this.productSaleForm.controls['classification'].enable();
    this.productSaleForm.controls['productName'].enable();
    this.productSaleForm.controls['price'].enable();
    this.productSaleForm.controls['srp'].enable();
    const convertedTransactionDate = moment(this.productSaleForm.value.transactionDateTemp).format('YYYY-MM-DD');
    this.productSaleForm.patchValue({ transactionDate: convertedTransactionDate });
    this.productSaleForm.controls['transactionDateTemp'].disable();
    this.cashierService.productSale(this.productSaleForm.value, this.saleData.id)
      .subscribe({
        next:()=>{
          alert("Product Sell Success!");
          this.productSaleForm.reset();
          this.dialogRef.close('sale');
        },
        error:()=>{
          alert("Error");
        }
      })
  }

}
