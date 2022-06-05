import { DialogComponent } from './components/dialog/dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ProductService } from './services/product.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'product-system-v1';

  displayedColumns: string[] = ['cashier', 'name', 'classification', 'remainingStock', 'totalStock', 'sold', 'pricePerPc', 'srpPerPc', 'totalPriceRemaining', 'totalPriceSold', 'profit', 'expiryDate', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog,
              private productService: ProductService) {

  }
  ngOnInit(): void {
    this.getAllProducts();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'50%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllProducts();
      }
    })
  }

  getAllProducts() {
    this.productService.getProducts()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("Error While Fetiching The Products!")
      }
    })
  }

  editProduct(row : any) {
    this.dialog.open(DialogComponent,{
      width: '50%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllProducts();
      }
    })
  }

  deleteProduct(id:number){
    return this.productService.deleteProduct(id)
    .subscribe({
      next: (res) => {
        alert("Product Deleted Successfully!")
        this.getAllProducts();
      },
      error:()=>{
        alert("Error While Deleting The Record")
        this.getAllProducts();
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
