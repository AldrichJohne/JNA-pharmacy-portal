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
  dataSourceGalenicals!: MatTableDataSource<any>;
  dataSourceIceCream!: MatTableDataSource<any>;
  dataSourceOthers!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog,
              private productService: ProductService) {

  }
  ngOnInit(): void {
    this.loadTables();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'50%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.loadTables();
      }
    })
  }

  loadTables() {
    this.getAllBranded();
    this.getAllGenerics();
    this.getAllGalenicals();
    this.getAllIceCream();
    this.getAllOthers();
  }

  //Table data
  getAllBranded() {
    this.productService.getBranded()
    .subscribe({
      next:(res)=>{
        this.dataSourceBranded = new MatTableDataSource(res);
        this.dataSourceBranded.paginator = this.paginator;
        this.dataSourceBranded.sort = this.sort;
      },
      error:(err)=>{
        alert("Error While Fetching The Products!")
      }
    })
  }
  getAllGenerics() {
    this.productService.getGeneric()
      .subscribe({
        next:(res)=>{
          this.dataSourceGeneric = new MatTableDataSource(res);
          this.dataSourceGeneric.paginator = this.paginator;
          this.dataSourceGeneric.sort = this.sort;
        },
        error:(err)=>{
          alert("Error While Fetching The Products!")
        }
      })
  }
  getAllGalenicals() {
    this.productService.getGalenical()
      .subscribe({
        next:(res)=>{
          this.dataSourceGalenicals = new MatTableDataSource(res);
          this.dataSourceGalenicals.paginator = this.paginator;
          this.dataSourceGalenicals.sort = this.sort;
        },
        error:(err)=>{
          alert("Error While Fetching The Products!")
        }
      })
  }
  getAllIceCream() {
    this.productService.getIceCream()
      .subscribe({
        next:(res)=>{
          this.dataSourceIceCream = new MatTableDataSource(res);
          this.dataSourceIceCream.paginator = this.paginator;
          this.dataSourceIceCream.sort = this.sort;
        },
        error:(err)=>{
          alert("Error While Fetching The Products!")
        }
      })
  }
  getAllOthers() {
    this.productService.getOthers()
      .subscribe({
        next:(res)=>{
          this.dataSourceOthers = new MatTableDataSource(res);
          this.dataSourceOthers.paginator = this.paginator;
          this.dataSourceOthers.sort = this.sort;
        },
        error:(err)=>{
          alert("Error While Fetching The Products!")
        }
      })
  }

  //Table actions
  editProduct(row : any) {
    this.dialog.open(DialogComponent,{
      width: '50%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.loadTables();
      }
    })
  }
  deleteProduct(id:number){
    return this.productService.deleteProduct(id)
    .subscribe({
      next: (res) => {
        alert("Product Deleted Successfully!")
        this.loadTables();
      },
      error:()=>{
        alert("Error While Deleting The Record")
        this.loadTables();
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceBranded.filter = filterValue.trim().toLowerCase();
    this.dataSourceGeneric.filter = filterValue.trim().toLowerCase();
    this.dataSourceGalenicals.filter = filterValue.trim().toLowerCase();
    this.dataSourceIceCream.filter = filterValue.trim().toLowerCase();
    this.dataSourceOthers.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceBranded.paginator) {
      this.dataSourceBranded.paginator.firstPage();
    } else if (this.dataSourceGeneric.paginator) {
      this.dataSourceGeneric.paginator.firstPage();
    }
  }
}
