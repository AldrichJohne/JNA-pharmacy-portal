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
  dataSourceBranded!: MatTableDataSource<any>;
  dataSourceGeneric!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog,
              private productService: ProductService) {

  }
  ngOnInit(): void {
    this.getAllBranded();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'50%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllBranded();
      }
    })
  }

  getAllBranded() {
    this.productService.getBranded()
    .subscribe({
      next:(res)=>{
        this.dataSourceBranded = new MatTableDataSource(res);
        this.dataSourceBranded.paginator = this.paginator;
        this.dataSourceBranded.sort = this.sort;
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
        this.getAllBranded();
      }
    })
  }

  deleteProduct(id:number){
    return this.productService.deleteProduct(id)
    .subscribe({
      next: (res) => {
        alert("Product Deleted Successfully!")
        this.getAllBranded();
      },
      error:()=>{
        alert("Error While Deleting The Record")
        this.getAllBranded();
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceBranded.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceBranded.paginator) {
      this.dataSourceBranded.paginator.firstPage();
    }
  }
}
