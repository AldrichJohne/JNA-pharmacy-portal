import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from "moment";
import {ProductService} from "../../services/product.service";
import {NotifPromptComponent} from "../notif-prompt/notif-prompt.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-batch-product',
  templateUrl: './add-batch-product.component.html',
  styleUrls: ['./add-batch-product.component.scss']
})
export class AddBatchProductComponent implements OnInit {

  productList: any[] = [];
  addProductForm!: FormGroup;
  currentDate = new Date();
  notifyMessage = '';
  notifyStatus = '';

  constructor(private cdRef: ChangeDetectorRef,
              private productService: ProductService,
              private formBuilder : FormBuilder,
              private dialog : MatDialog,
              private dialogRef : MatDialogRef<AddBatchProductComponent>) { }

  ngOnInit(): void {
    this.addProductForm = this.formBuilder.group({
      name: ['',Validators.required],
      classId: ['',Validators.required],
      totalStock: ['',Validators.required],
      pricePerPc: ['',Validators.required],
      srpPerPc: ['',Validators.required],
      expiryDateTemp: ['',Validators.required],
      expiryDate:['']
    });

    this.clearForm();
  }

  displayedColumns: string[] = ['name', 'classId', 'totalStock', 'pricePerPc', 'srpPerPc', 'expiryDate', 'actions'];
  dataSource = new MatTableDataSource(this.productList);

  addProductToList() {
    const convertedExpiryDate = moment(this.addProductForm.value.expiryDateTemp).format('YYYY-MM-DD');
    this.addProductForm.patchValue({ expiryDate: convertedExpiryDate });
    const newProduct = {
      name: this.addProductForm.controls['name'].value,
      totalStock: this.addProductForm.controls['totalStock'].value,
      pricePerPc: this.addProductForm.controls['pricePerPc'].value,
      srpPerPc: this.addProductForm.controls['srpPerPc'].value,
      expiryDate: this.addProductForm.controls['expiryDate'].value,
      classId: this.addProductForm.controls['classId'].value,
    };

    this.productList.push(newProduct);
    this.dataSource.data = this.productList;
    this.cdRef.detectChanges();
    this.clearForm();
  }

  clearProductList() {
    this.productList = [];
    this.dataSource.data = this.productList;
    this.cdRef.detectChanges();
  }

  clearForm() {
    this.addProductForm.controls['name'].setValue('');
    this.addProductForm.controls['pricePerPc'].setValue('');
    this.addProductForm.controls['srpPerPc'].setValue('');
    this.addProductForm.controls['expiryDate'].setValue('');
    this.addProductForm.controls['classId'].setValue('');
    this.addProductForm.controls['totalStock'].setValue(0);
    this.addProductForm.controls['expiryDateTemp'].setValue(this.currentDate);
  }

  removeProductFromList(row : any) {
    const index = this.productList.indexOf(row);
    this.productList.splice(index, 1);
    this.dataSource.data = this.productList;
    this.cdRef.detectChanges();
    this.clearForm();
  }

  saveBatchProduct() {
    let productListFinal: any[] = [];
    productListFinal = this.productList;
    for (let loopIndex = 0; loopIndex < productListFinal.length; loopIndex ++) {
      if (this.dataSource.data[loopIndex].classId == 'Branded') {
        this.dataSource.data[loopIndex].classId = 1;
      } else if (this.dataSource.data[loopIndex].classId == 'Generic') {
        this.dataSource.data[loopIndex].classId = 2;
      } else if (this.dataSource.data[loopIndex].classId == 'Galenical') {
        this.dataSource.data[loopIndex].classId = 3;
      } else if (this.dataSource.data[loopIndex].classId == 'Ice Cream') {
        this.dataSource.data[loopIndex].classId = 4;
      } else {
        this.dataSource.data[loopIndex].classId = 5;
      }
    }

    this.productService.addBatchProduct(productListFinal)
      .subscribe({
        next:()=>{
          this.notifyMessage = 'Products Added Successfully.';
          this.notifyStatus = 'OK';
          this.OpenNotifyDialog();
          this.productList = [];
          this.dataSource.data = this.productList;
          this.cdRef.detectChanges();
        },
        error:()=>{
          this.notifyMessage = 'Error Adding Products';
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

  closeDialog() {
    this.dialogRef.close();
  }
}
