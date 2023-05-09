import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import * as moment from 'moment';
import {NotifPromptComponent} from "../prompts/notif-prompt/notif-prompt.component";

@Component({
  selector: 'app-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss']
})
export class AddProductDialogComponent implements OnInit {

  productForm!: FormGroup;
  currentDate = new Date();
  notifyMessage = '';
  notifyStatus = '';

  constructor(private formBuilder : FormBuilder,
              private productService: ProductService,
              @Inject(MAT_DIALOG_DATA) public editData : any,
              private dialogRef : MatDialogRef<AddProductDialogComponent>,
              private dialog : MatDialog) { }

  ngOnInit(): void {
      this.productForm = this.formBuilder.group({
        name: ['',Validators.required],
        category: ['',Validators.required],
        totalStock: ['',Validators.required],
        pricePerPc: ['',Validators.required],
        srpPerPc: ['',Validators.required],
        expiryDateTemp: ['',Validators.required],
        expiryDate:['']
      });

      this.productForm.controls['totalStock'].setValue(0);
      this.productForm.controls['expiryDateTemp'].setValue(this.currentDate);

  }

  addProduct() {
    const capital = this.productForm.controls['pricePerPc'].value;
    const retailPrice = this.productForm.controls['srpPerPc'].value;
    if (capital != '' && retailPrice != '' && capital >= retailPrice) {
      this.productForm.controls['srpPerPc'].setValue('');
      this.productForm.controls['pricePerPc'].setValue('');
      this.notifyMessage = "Capital should be smaller than SRP.";
      this.notifyStatus = "ERROR";
      this.openNotifyDialog();
    } else {
      this.productForm.controls['expiryDate'].enable();
      const convertedExpiryDate = moment(this.productForm.value.expiryDateTemp).format('YYYY-MM-DD');
      this.productForm.patchValue({ expiryDate: convertedExpiryDate });
      this.productService.setCategory(JSON.stringify(this.productForm.get('category')!.value));
      if(this.productForm.valid) {
        this.productService.addProduct(this.productForm.value)
          .subscribe({
            next:()=>{
              this.notifyMessage = 'Product Added Successfully';
              this.notifyStatus = 'OK';
              this.openNotifyDialog();
              this.productForm.reset();
              this.dialogRef.close('save');
            },
            error:()=>{
              this.notifyMessage = 'Error Adding Product';
              this.notifyStatus = 'ERROR';
              this.openNotifyDialog();
            }
          })
      }
      else {
        this.notifyMessage = 'Missing required fields.';
        this.notifyStatus = 'ERROR';
        this.openNotifyDialog();
      }
    }
  }

  openNotifyDialog() {
    this.dialog.open(NotifPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }
}
