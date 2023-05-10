import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from "moment";
import {ProductService} from "../../services/product.service";
import {NotifPromptComponent} from "../prompts/notif-prompt/notif-prompt.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddBatchProductsConfirmationPromptsComponent} from "../prompts/add-batch-products-confirmation-prompts/add-batch-products-confirmation-prompts.component";
import {Subscription} from "rxjs";
import {SharedEventService} from "../../services/shared-event.service";

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
  confirmationMessage = '';
  triggeredBy = '';
  subscription: Subscription;
  displayedColumns: string[] = ['name', 'classId', 'totalStock', 'pricePerPc', 'srpPerPc', 'expiryDate', 'actions'];
  dataSource = new MatTableDataSource(this.productList);

  constructor(private cdRef: ChangeDetectorRef,
              private productService: ProductService,
              private formBuilder : FormBuilder,
              private dialog : MatDialog,
              private dialogRef : MatDialogRef<AddBatchProductComponent>,
              public shareEventService: SharedEventService) {
    this.subscription = this.shareEventService.batchAddButtonTrigger.subscribe(
      message => {
        if (message == 'CLOSE-BUTTON') {
          this.closeThisDialog();
        } else if (message == 'CLEAR-TABLE-BUTTON') {
          this.clearProductList();
        } else if (message == 'SAVE-BUTTON') {
          this.saveBatchProduct();
        }
      }
    )
  }

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

  addProductToList() {
    if (this.addProductForm.invalid) {
      this.notifyMessage = 'Missing required filed.'
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
    } else {
      const capital = this.addProductForm.controls['pricePerPc'].value;
      const retailPrice = this.addProductForm.controls['srpPerPc'].value;
      if (capital >= retailPrice) {
        this.addProductForm.controls['srpPerPc'].setValue('');
        this.addProductForm.controls['pricePerPc'].setValue('');
        this.notifyMessage = "Capital should be smaller than SRP.";
        this.notifyStatus = "ERROR";
        this.openNotifyDialog();
      } else {
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
    }
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
    let productListFinal: any[];
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
      } else if (this.dataSource.data[loopIndex].classId == 'Others') {
        this.dataSource.data[loopIndex].classId = 5;
      }
    }

    this.productService.addBatchProduct(productListFinal)
      .subscribe({
        next:()=>{
          this.productList = [];
          this.dataSource.data = this.productList;
          this.cdRef.detectChanges();
          this.shareEventService.triggerRefreshTable.next(true);
          this.notifyMessage = 'Products Added Successfully.';
          this.notifyStatus = 'OK';
          this.openNotifyDialog();
        },
        error:()=>{
          this.notifyMessage = 'Error Adding Products';
          this.notifyStatus = 'ERROR';
          this.openNotifyDialog();
          this.shareEventService.triggerRefreshTable.next(true);
        }
      })
  }

  openNotifyDialog() {
    this.dialog.open(NotifPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

  confirmClose() {
    if (this.productList.length === 0) {
      this.dialogRef.close();
    } else {
      this.triggeredBy = "CLOSE-BUTTON";
      this.confirmationMessage = "Are you sure you want to close the page? the table data will disappear when closed."
      this.openConfirmationDialog();
    }
  }

  confirmClearTable() {
    if (this.productList.length === 0) {
      this.notifyMessage = 'There is no product present in the list.';
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
    } else {
      this.triggeredBy = "CLEAR-TABLE-BUTTON";
      this.confirmationMessage = "Are you sure you want to clear all data from the table and not save them?."
      this.openConfirmationDialog();
    }
  }

  confirmSave() {
    if (this.productList.length === 0) {
      this.notifyMessage = 'There is no product present in the list.';
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
    } else {
      this.triggeredBy = "SAVE-BUTTON";
      this.confirmationMessage = "Are you sure you want to save product/s to the database?."
      this.openConfirmationDialog();
    }
  }

  openConfirmationDialog() {
    this.dialog.open(AddBatchProductsConfirmationPromptsComponent, {
      width: '20%',
      data: {message: this.confirmationMessage, triggeredBy: this.triggeredBy}
    });
  }

  closeThisDialog() {
    this.dialogRef.close();
  }

}
