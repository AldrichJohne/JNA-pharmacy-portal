import { AddProductDialogComponent } from './components/add-product-dialog/add-product-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ProductService } from './services/product.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SaleDialogComponent} from "./components/sale-dialog/sale-dialog.component";
import {SaleReportsService} from "./services/sale-reports.service";
import {CashierService} from "./services/cashier.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'product-system-v1';

  displayedColumnsProducts: string[] = ['cashier', 'name', 'classification', 'remainingStock', 'totalStock', 'sold', 'pricePerPc', 'srpPerPc', 'totalPriceRemaining', 'totalPriceSold', 'profit', 'expiryDate', 'action'];
  dataSourceProducts!: MatTableDataSource<any>;
  dataSourceSales!: MatTableDataSource<any>;
  @ViewChild('productsPaginator') productsPaginator!: MatPaginator;
  @ViewChild('salesPaginator') salesPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog,
              private productService: ProductService,
              private cashierService: CashierService,
              private reportService: SaleReportsService) {
  }
  ngOnInit(): void {

  }



}
