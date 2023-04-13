import {Component, OnInit, ViewChild} from '@angular/core';
import {AddProductDialogComponent} from "../add-product-dialog/add-product-dialog.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {ProductService} from "../../services/product.service";
import {SaleDialogComponent} from "../sale-dialog/sale-dialog.component";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CashierService} from "../../services/cashier.service";
import {DeletePromptComponent} from "../delete-prompt/delete-prompt.component";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  displayedColumnsProducts: string[] = ['cashier', 'name', 'classification', 'remainingStock', 'totalStock', 'sold', 'pricePerPc', 'srpPerPc', 'totalPriceRemaining', 'totalPriceSold', 'profit', 'expiryDate', 'action'];
  dataSourceProducts!: MatTableDataSource<any>;
  @ViewChild('productsPaginator') productsPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog,
                private productService: ProductService) {
  }

  ngOnInit(): void {
    this.getAllProductList();
  }

  openProductDialog() {
    this.dialog.open(AddProductDialogComponent, {
      width:'50%'
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
    this.dialog.open(SaleDialogComponent, {
      width:'50%',
      data:row
    }).afterClosed().subscribe(val => {
        this.getAllProductList();
    })
  }

  openDeletePrompt(row : any) {
    this.dialog.open(DeletePromptComponent, {
      width: '25%',
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

  deleteProduct(id : number){
    return this.productService.deleteProduct(id)
      .subscribe({
        next: () => {
          alert("Product Deleted Successfully!")
          this.getAllProductList();
        },
        error:()=>{
          alert("Error While Deleting The Record")
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
        },
        error:()=>{
          alert("Error While Fetching The Products!")
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

}
