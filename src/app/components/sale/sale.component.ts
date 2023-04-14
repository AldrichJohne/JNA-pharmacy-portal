import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {CashierService} from "../../services/cashier.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {NotifPromptComponent} from "../notif-prompt/notif-prompt.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {

  notifyMessage = '';
  notifyStatus = '';

  displayedColumnsSales: string[] = ['name','classification','price','srp','sold','amount','profit','isDiscounted','transactionDate'];
  dataSourceSales!: MatTableDataSource<any>;
  @ViewChild('salesPaginator') salesPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private cashierService: CashierService,
              private dialog : MatDialog) { }

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
          console.log(res)
        },
        error:()=>{
          this.notifyMessage = 'Error While Fetching The Product Sales';
          this.notifyStatus = 'ERROR';
          this.openNotifyDialog();
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

  openNotifyDialog() {
    this.dialog.open(NotifPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

}
