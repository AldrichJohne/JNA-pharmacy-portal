import {Component, Inject, OnInit} from '@angular/core';
import {CashierService} from "../../services/cashier.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  productsOnCart: any;
  displayedColumns: string[] = ['productId', 'name', 'class', 'price', 'srp', 'quantity', 'isDiscounted', 'pharmacist', 'transactionDate', 'actions'];
  dataSource = new MatTableDataSource(this.cartData);
  totalPrice = '50';

  constructor(private cashierService: CashierService,
              @Inject(MAT_DIALOG_DATA) public cartData : any,
              private dialogRef : MatDialogRef<CartComponent>,
              private dialog : MatDialog) { }

  ngOnInit(): void {
    this.productsOnCart = this.cartData;
    console.log(this.cartData)
  }

  confirmClose(){
    this.dialogRef.close();
  }

}
