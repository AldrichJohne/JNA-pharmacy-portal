import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from "moment";
import {ProductService} from "../../services/product.service";
import {NotifPromptComponent} from "../prompts/notif-prompt/notif-prompt.component";

@Component({
  selector: 'app-update-product-form',
  templateUrl: './update-product-form.component.html',
  styleUrls: ['./update-product-form.component.scss']
})
export class UpdateProductFormComponent implements OnInit {

  productForm!: FormGroup;
  name = '';
  class = '';
  currentStock = '';
  totalStock = '';
  sold = '';
  capital = '';
  retailPrice = '';
  gross = '';
  profit = '';
  expiration = '';

  notifyMessage = '';
  notifyStatus = '';

  constructor(@Inject(MAT_DIALOG_DATA) public editData : any,
              private dialogRef : MatDialogRef<UpdateProductFormComponent>,
              private dialog : MatDialog,
              private formBuilder : FormBuilder,
              private productService: ProductService) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['',Validators.required],
      category: ['',Validators.required],
      totalStock: ['',Validators.required],
      expiryDateTemp: ['',Validators.required],
      expiryDate:['']
    });

    this.name = this.editData.name;
    this.class = this.editData.plainClassificationDto.name;
    this.currentStock = this.editData.remainingStock;
    this.totalStock = this.editData.totalStock;
    this.sold = this.editData.sold;
    this.capital = this.editData.pricePerPc;
    this.retailPrice = this.editData.srpPerPc;
    this.gross = this.editData.gross;
    this.profit = this.editData.profit;
    this.expiration = this.editData.expiryDate;

    this.productForm.controls['name'].setValue(this.name);
    this.productForm.controls['totalStock'].setValue(this.totalStock);
    this.productForm.controls['expiryDateTemp'].setValue(this.expiration);


  }

  closeForm() {
    this.dialogRef.close();
  }

  updateProduct() {
    if (this.productForm.controls['totalStock'].value < this.sold) {
      this.notifyMessage = "You can't make total stock lesser than sold, it will become negative.";
      this.notifyStatus = "ERROR";
      this.openNotifyDialog();
      this.productForm.controls['totalStock'].setValue(this.totalStock);
    } else {
      const convertedExpiryDate = moment(this.productForm.value.expiryDateTemp).format('YYYY-MM-DD');
      const updatedProductValue = {
        name: this.productForm.controls['name'].value,
        totalStock: this.productForm.controls['totalStock'].value,
        expiryDate: convertedExpiryDate
      };

      this.productService.updateProduct(updatedProductValue, this.editData.id)
        .subscribe({
          next:()=>{
            this.notifyMessage = 'Product Updated Successfully';
            this.notifyStatus = 'OK';
            this.openNotifyDialog();
            this.productForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            this.notifyMessage = 'Error Updating Product';
            this.notifyStatus = 'ERROR';
            this.openNotifyDialog();
          }
        })
    }
  }

  openNotifyDialog() {
    this.dialog.open(NotifPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

}
