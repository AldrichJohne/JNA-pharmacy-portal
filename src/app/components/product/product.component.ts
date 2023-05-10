import {Component, OnInit, ViewChild} from '@angular/core';
import {AddProductDialogComponent} from "../add-product-dialog/add-product-dialog.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {ProductService} from "../../services/product.service";
import {SaleDialogComponent} from "../sale-dialog/sale-dialog.component";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DeletePromptComponent} from "../prompts/delete-prompt/delete-prompt.component";
import {NotifPromptComponent} from "../prompts/notif-prompt/notif-prompt.component";
import {SharedEventService} from "../../services/shared-event.service";
import {Subscription} from "rxjs";
import {AddBatchProductComponent} from "../add-batch-product/add-batch-product.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UpdateProductFormComponent} from "../update-product-form/update-product-form.component";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  notifyMessage = '';
  notifyStatus = '';
  subscription: Subscription;
  pharmacistOnDuty = '';
  productPageForm!: FormGroup;
  currentStock = '';

  displayedColumnsProducts: string[] = ['cashier', 'name', 'className', 'remainingStock', 'totalStock', 'sold', 'pricePerPc', 'srpPerPc', 'totalGross', 'profit', 'expiryDate', 'status', 'action'];
  dataSourceProducts!: MatTableDataSource<any>;
  @ViewChild('productsPaginator') productsPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog,
              private productService: ProductService,
              public shareEventService: SharedEventService,
              private formBuilder : FormBuilder) {
    this.subscription = this.shareEventService.triggerRefreshTable.subscribe(
      message => {
        if (message) {
          this.getAllProductList();
        }
      }
    );
  }

  ngOnInit(): void {
    this.productPageForm = this.formBuilder.group({
      addProductDropDownTrigger: ['']
    });
    this.shareEventService.pharmacistGlobal$.subscribe(value =>{
      this.pharmacistOnDuty = value;
    });
    this.getAllProductList();
  }



  emitGetALlSales() {
    this.shareEventService.triggerRefreshTable.next(true);
  }

  openProductDialog() {
    this.dialog.open(AddProductDialogComponent, {
      width:'50%',
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllProductList();
      }
    })
  }

  applyFilterProducts(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProducts.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceProducts.paginator) {
      this.dataSourceProducts.paginator.firstPage();
    }
  }

  openSalesDialog(row : any) {
    if (this.pharmacistOnDuty == '') {
      this.notifyMessage = 'Please select a pharmacist on duty.'
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
    } else {
      this.dialog.open(SaleDialogComponent, {
        width:'50%',
        data:row
      }).afterClosed().subscribe(val => {
        this.getAllProductList();
        this.emitGetALlSales();
      })
    }
  }

  openDeletePrompt(row : any) {
    this.dialog.open(DeletePromptComponent, {
      width: '20%',
      data: row
    }).afterClosed().subscribe(val => {
      this.getAllProductList();
    })
  }

  editProduct(row : any) {
    this.dialog.open(AddProductDialogComponent,{
      width: '50%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllProductList();
      }
    })
  }

  getAllProductList() {
    this.productService.getProductList()
      .subscribe({
        next:(res)=>{
          this.dataSourceProducts = new MatTableDataSource(res);
          this.dataSourceProducts.paginator = this.productsPaginator;
          this.dataSourceProducts.sort = this.sort;
          this.checkProductStatus(res);
          this.checkProductRemainingStock(res);
        },
        error:()=>{
          this.notifyMessage = 'Error While Fetching The Products';
          this.notifyStatus = 'ERROR';
          this.openNotifyDialog();
        }
      })
  }

  saleProduct(row : any) {
    this.dialog.open(AddProductDialogComponent,{
      width: '50%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='sale'){
        this.getAllProductList();
      }
    })
  }

  openNotifyDialog() {
    this.dialog.open(NotifPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

  openAddBatchProductDialog() {
    this.dialog.open(AddBatchProductComponent, {
      width: '100vw', /* Set the dialog width to 100% of the viewport */
      height: '100vh', /* Set the dialog height to 100% of the viewport */
      maxWidth: '100vw', /* Make sure the dialog does not exceed the viewport width */
      maxHeight: '100vh', /* Make sure the dialog does not exceed the viewport height */
      panelClass: 'full-screen-dialog' /* Add a custom class to the dialog */
    }).afterClosed().subscribe(value => {
      this.getAllProductList();
    });
  }

  openUpdateProductForm(row : any) {
    this.dialog.open(UpdateProductFormComponent, {
      width: '50%',
      data: row
    }).afterClosed().subscribe(val=>{
      this.getAllProductList();
    })
  }

  checkProductRemainingStock(response: any) {
    for (const row of response) {
      if (row.remainingStock == 0) {
        row.remainingStock = "out of stocks";
      }
    }
  }

  checkProductStatus(response: any) {
    for (const row of response) {
      const givenExpiryDate = new Date(row.expiryDate);
      const currentDate = new Date();
      const timeDiff = givenExpiryDate.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      row.expiryStatus = this.convertExpiryStatus(daysDiff);
      if (daysDiff <= 0) {
        row.disableCashier = true;
      }
      if (row.remainingStock <= 0) {
        row.disableCashier = true;
      }
    }
  }

  convertExpiryStatus(expiryStatus: number): string {
    let result = '';
    if (expiryStatus <= 0) {
      result = 'Expired';
    } else if (expiryStatus < 30) {
      result = `${expiryStatus} day${expiryStatus > 1 ? 's' : ''}`;
    } else if (expiryStatus < 365) {
      const months = Math.floor(expiryStatus / 30);
      const days = expiryStatus % 30;
      result = `${months} month${months > 1 ? 's' : ''}`;
      if (days > 0) {
        result += `, ${days} day${days > 1 ? 's' : ''}`;
      }
    } else {
      const years = Math.floor(expiryStatus / 365);
      const months = Math.floor((expiryStatus % 365) / 30);
      const days = (expiryStatus % 365) % 30;
      result = `${years} year${years > 1 ? 's' : ''}`;
      if (months > 0) {
        result += `, ${months} month${months > 1 ? 's' : ''}`;
      }
      if (days > 0) {
        result += `, ${days} day${days > 1 ? 's' : ''}`;
      }
    }
    return result;
  }

}
