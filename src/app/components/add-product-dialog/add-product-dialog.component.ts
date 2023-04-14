import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import * as moment from 'moment';
import {NotifPromptComponent} from "../notif-prompt/notif-prompt.component";

@Component({
  selector: 'app-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss']
})
export class AddProductDialogComponent implements OnInit {

  productForm!: FormGroup;
  actionBtn: string = "Save"
  productFormTitle: string = "ADD PRODUCT"
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

    if(this.editData) {
      this.productForm.controls['category'].disable();
      this.actionBtn = "Update";
      this.productFormTitle = "UPDATE PRODUCT"
      this.productForm.controls['name'].setValue(this.editData.name);
      this.productForm.controls['category'].setValue(this.editData.plainClassificationDto.id);
      this.productForm.controls['totalStock'].setValue(this.editData.totalStock);
      this.productForm.controls['pricePerPc'].setValue(this.editData.pricePerPc);
      this.productForm.controls['srpPerPc'].setValue(this.editData.srpPerPc);
      this.productForm.controls['expiryDateTemp'].setValue(this.editData.expiryDate);
      this.productForm.controls['expiryDate'].disable();
    }
  }

  addProduct() {
    this.productForm.controls['expiryDate'].enable();
    const convertedExpiryDate = moment(this.productForm.value.expiryDateTemp).format('YYYY-MM-DD');
    this.productForm.patchValue({ expiryDate: convertedExpiryDate });
    this.productForm.controls['expiryDateTemp'].disable();
    this.productService.setCategory(JSON.stringify(this.productForm.get('category')!.value));
    if(!this.editData){
      if(this.productForm.valid) {
        this.productService.addProduct(this.productForm.value)
          .subscribe({
            next:()=>{
              this.notifyMessage = 'Product Added Successfully';
              this.notifyStatus = 'OK';
              this.OpenNotifyDialog();
              this.productForm.reset();
              this.dialogRef.close('save');
            },
            error:()=>{
              this.notifyMessage = 'Error Adding Product';
              this.notifyStatus = 'ERROR';
              this.OpenNotifyDialog();
            }
          })
      }
    } else {
      this.updateProduct()
    }
  }

  updateProduct() {
    this.productService.updateProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next:()=>{
        this.notifyMessage = 'Product Updated Successfully';
        this.notifyStatus = 'OK';
        this.OpenNotifyDialog();
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        this.notifyMessage = 'Error Updating Product';
        this.notifyStatus = 'ERROR';
        this.OpenNotifyDialog();
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
