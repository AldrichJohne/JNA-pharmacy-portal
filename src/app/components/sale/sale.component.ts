import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {CashierService} from "../../services/cashier.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {NotifPromptComponent} from "../prompts/notif-prompt/notif-prompt.component";
import {MatDialog} from "@angular/material/dialog";
import {DeletePromptSaleComponent} from "../prompts/delete-prompt-sale/delete-prompt-sale.component";
import {SharedEventService} from "../../services/shared-event.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {

  notifyMessage = '';
  notifyStatus = '';
  eventEmitter = false;
  subscription: Subscription;

  displayedColumnsSales: string[] = ['pharmacist', 'name','classification','price','srp','sold','amount','profit','isDiscounted','transactionDate', 'action'];
  dataSourceSales!: MatTableDataSource<any>;
  @ViewChild('salesPaginator') salesPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private cashierService: CashierService,
              private dialog : MatDialog,
              public shareEventService: SharedEventService) {
    this.subscription = this.shareEventService.triggerRefreshTable.subscribe(
      message => {
        this.eventEmitter = message;
        if (this.eventEmitter) {
          this.getAllSales();
        }
      }
    );
  }

  ngOnInit(): void {
    this.getAllSales();
  }

  emitGetAllProducts() {
    this.shareEventService.triggerRefreshTable.next(true);
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

  openDeletePrompt(row : any) {
    this.dialog.open(DeletePromptSaleComponent, {
      width: '20%',
      data: row
    }).afterClosed().subscribe(val => {
      this.getAllSales();
      this.emitGetAllProducts();
    })
  }

}
