import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {CashierService} from "../../services/cashier.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {

  displayedColumnsSales: string[] = ['name','classification','price','srp','sold','amount','profit','discounted','transactionDate'];
  dataSourceSales!: MatTableDataSource<any>;
  @ViewChild('salesPaginator') salesPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private cashierService: CashierService) { }

  ngOnInit(): void {
    this.getAllSales();
  }

  getAllSales() {
    this.cashierService.getProductSales()
      .subscribe({
        next:(res)=>{
          this.dataSourceSales = new MatTableDataSource(res);
          this.dataSourceSales.paginator = this.salesPaginator;
          this.dataSourceSales.sort = this.sort;
        },
        error:()=>{
          alert("Error While Fetching The Product Sales")
        }
      })
  }

  applyFilterSales(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceSales.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceSales.paginator) {
      this.dataSourceSales.paginator.firstPage();
    }
  }

}
