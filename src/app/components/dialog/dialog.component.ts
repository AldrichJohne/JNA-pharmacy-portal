import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  productForm !: FormGroup;
  actionBtn: string = "Save"

  constructor(private formBuilder : FormBuilder, 
              private productService: ProductService,
              @Inject(MAT_DIALOG_DATA) public editData : any, 
              private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['',Validators.required],
      category: ['',Validators.required],
      totalStock: ['',Validators.required],
      pricePerPc: ['',Validators.required],
      srpPerPc: ['',Validators.required],
      expiryDate: ['',Validators.required]
    });

    if(this.editData) {
      this.productForm.controls['category'].disable();
      this.actionBtn = "Update";
      this.productForm.controls['name'].setValue(this.editData.name);
      this.productForm.controls['category'].setValue(this.editData.plainClassificationDto.id);
      this.productForm.controls['totalStock'].setValue(this.editData.totalStock);
      this.productForm.controls['pricePerPc'].setValue(this.editData.pricePerPc);
      this.productForm.controls['srpPerPc'].setValue(this.editData.srpPerPc);
      this.productForm.controls['expiryDate'].setValue(this.editData.expiryDate);
    }
  }

  addProduct() {
    this.productService.setCategory(JSON.stringify(this.productForm.get('category')!.value));
    if(!this.editData){
      if(this.productForm.valid) {
        this.productService.postProduct(this.productForm.value)
          .subscribe({
            next:(res)=>{
              alert("Product added succesfully!");
              this.productForm.reset();
              this.dialogRef.close('save');
            },
            error:()=>{
              alert("Error while adding the product");
            }
          })
      }
    } else {
      this.updateProduct()
    }
  }

  updateProduct() {
    this.productService.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Product Updated Successfully!");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Error while updating the product");
      }
    })
  }

}
