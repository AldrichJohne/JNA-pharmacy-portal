import { Component, Inject, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sale-dialog',
  templateUrl: './sale-dialog.component.html',
  styleUrls: ['./sale-dialog.component.scss']
})
export class SaleDialogComponent implements OnInit {

  productSaleForm!: FormGroup;
  productSaleFormTitle: string = "SALE"
  currentDate = new Date();

  constructor(private formBuilder : FormBuilder,
              private productService: ProductService,
              @Inject(MAT_DIALOG_DATA) public saleData : any,
              private dialogRef : MatDialogRef<SaleDialogComponent>) { }

  ngOnInit(): void {
    this.productSaleForm = this.formBuilder.group({
      category:['',Validators.required],
      productName:['',Validators.required],
      price:['',Validators.required],
      srp:['',Validators.required],
      soldQuantity:['',Validators.required],
      transactionDate:['',Validators.required]
    })

    this.productSaleForm.controls['category'].disable();
    this.productSaleForm.controls['productName'].disable();
    this.productSaleForm.controls['price'].disable();
    this.productSaleForm.controls['srp'].disable();
    this.productSaleForm.controls['category'].setValue(this.saleData.plainClassificationDto.name);
    this.productSaleForm.controls['productName'].setValue(this.saleData.name);
    this.productSaleForm.controls['price'].setValue(this.saleData.pricePerPc);
    this.productSaleForm.controls['srp'].setValue(this.saleData.srpPerPc);
    this.productSaleForm.controls['transactionDate'].setValue(this.currentDate);
  }

  sellProduct() {
    this.productSaleForm.controls['category'].enable();
    this.productSaleForm.controls['productName'].enable();
    this.productSaleForm.controls['price'].enable();
    this.productSaleForm.controls['srp'].enable();
    console.log(this.productSaleForm.value);
    this.productService.productSale(this.productSaleForm.value, this.saleData.id)
      .subscribe({
        next:(res)=>{
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
