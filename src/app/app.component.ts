import { DialogComponent } from './components/dialog/dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ProductService } from './services/product.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SaleDialogComponent} from "./components/sale-dialog/sale-dialog.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'product-system-v1';

  displayedColumnsProducts: string[] = ['cashier', 'name', 'classification', 'remainingStock', 'totalStock', 'sold', 'pricePerPc', 'srpPerPc', 'totalPriceRemaining', 'totalPriceSold', 'profit', 'expiryDate', 'action'];
  displayedColumnsSales: string[] = ['name','classification','price','srp','sold','amount','profit','transactionDate'];
  dataSourceProducts!: MatTableDataSource<any>;
  dataSourceSales!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog,
              private productService: ProductService) {

  }
  ngOnInit(): void {
    this.getAllProductList();
    this.getAllSales();
  }

  openProductDialog() {
    this.dialog.open(DialogComponent, {
      width:'50%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllProductList();
        this.getAllSales();
      }
    })
  }

  openSalesDialog(row : any) {
    this.dialog.open(SaleDialogComponent, {
      width:'50%',
      data:row
    }).afterClosed().subscribe(val => {
      if(val==='sale'){
        this.getAllProductList();
        this.getAllSales();
      }
    })
  }

  getAllProductList() {
    this.productService.getProductList()
      .subscribe({
      next:(res)=>{
        this.dataSourceProducts = new MatTableDataSource(res);
        this.dataSourceProducts.paginator = this.paginator;
        this.dataSourceProducts.sort = this.sort;
      },
      error:(err)=>{
        alert("Error While Fetching The Products!")
      }
    })
  }

  getAllSales() {
    this.productService.getProductSales()
      .subscribe({
        next:(res)=>{
          this.dataSourceSales = new MatTableDataSource(res);
          this.dataSourceProducts.paginator = this.paginator;
          this.dataSourceProducts.sort = this.sort;
        },
        error:(err)=>{
          alert("Error While Fetching The Product Sales")
        }
      })
  }

  editProduct(row : any) {
    this.dialog.open(DialogComponent,{
      width: '50%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllProductList();
      }
    })
  }

  saleProduct(row : any) {
    this.dialog.open(DialogComponent,{
      width: '50%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='sale'){
        this.getAllProductList();
      }
    })
  }

  deleteProduct(id:number){
    return this.productService.deleteProduct(id)
    .subscribe({
      next: (res) => {
        alert("Product Deleted Successfully!")
        this.getAllProductList();
      },
      error:()=>{
        alert("Error While Deleting The Record")
        this.getAllProductList();
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProducts.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceProducts.paginator) {
      this.dataSourceProducts.paginator.firstPage();
    }
  }
}
