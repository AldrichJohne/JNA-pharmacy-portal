import {Component, Inject, OnInit} from '@angular/core';
import {CashierService} from "../../services/cashier.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {SharedEventService} from "../../services/shared-event.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotifPromptComponent} from "../prompts/notif-prompt/notif-prompt.component";
import {jsPDF} from 'jspdf';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartForm!: FormGroup;
  productsOnCart: any;
  displayedColumns: string[] = ['productId', 'name', 'class', 'price', 'srp', 'quantity', 'isDiscounted', 'pharmacist', 'transactionDate', 'actions'];
  dataSource = new MatTableDataSource(this.cartData);
  totalPrice = 0;
  payment = 0;
  change = 0;
  notifyMessage = '';
  notifyStatus = '';
  businessName = 'JNA Pharmacy';
  businessAlias = 'JNAPh';
  businessAddress = 'Sinabaan, Bantay, Ilocos Sur';
  businessTIN = '000-111-2222';
  vatRate = 12;
  vatSale = 0;
  receiptProducts: any[] = [];


  constructor(private formBuilder : FormBuilder,
              private cashierService: CashierService,
              @Inject(MAT_DIALOG_DATA) public cartData : any,
              private dialogRef : MatDialogRef<CartComponent>,
              private dialog : MatDialog,
              public shareEventService: SharedEventService,
              public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.cartForm = this.formBuilder.group({
      payment:['',Validators.required]
    })

    this.productsOnCart = this.cartData;
    this.totalPrice = this.shareEventService.cartTotalSrp;
  }

  openNotifyDialog() {
    this.dialog.open(NotifPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

  confirmClose(){
    this.dialogRef.close();
  }

  clearField() {
    this.cartForm.reset();
    this.payment = 0;
    this.change = 0;
  }

  confirmPayment() {
    if (this.cartForm.controls['payment'].value < this.totalPrice) {
      this.notifyMessage = 'Payment should be higher or equals to total price';
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
      this.cartForm.reset();
    } else {
      this.payment = this.cartForm.controls['payment'].value;
      this.change = this.payment - this.totalPrice;
    }
  }

  generateReceipt() {
    this.generateProductOnReceipt();
    const currentDateTime = this.datePipe.transform(new Date(), 'MM/dd/yyyy h:mm:ss');
    const doc = new jsPDF();
    const textSpacing = 10;
    const startX = 10;
    let startY = 10;

    doc.text(this.businessName, startX, startY);
    startY += textSpacing;
    doc.text(this.businessAddress, startX, startY);
    startY += textSpacing;
    doc.text(this.businessTIN, startX, startY);
    startY += textSpacing;
    // @ts-ignore
    doc.text(currentDateTime, startX, startY);
    startY += textSpacing;
    doc.text('Txn #:SAMPLE00111', startX, startY);
    startY += textSpacing;
    startY += textSpacing;

    doc.text('SUBTOTAL: ' + this.totalPrice, startX, startY);
    startY += textSpacing;
    doc.text('(V)Vatable Sales: ' + this.vatSale, startX, startY);
    startY += textSpacing;
    doc.text('VAT Amount: ' + this.generateVATAmount(), startX, startY);

    // Product table headers
    const headers = ["product", "qty", "price"];
    const tableTopMargin = startY + textSpacing;

    // Draw table headers
    let tableX = startX;
    const tableY = tableTopMargin;
    const cellWidth = 40;
    const cellHeight = textSpacing;

    headers.forEach((header, index) => {
      doc.text(header, tableX, tableY);
      tableX += cellWidth;
    });

    // Product data
    const products = this.receiptProducts;

    // Draw product data
    let dataX = startX;
    let dataY = tableY + cellHeight;

    products.forEach((product) => {
      doc.text(product.productName, dataX, dataY);
      doc.text(product.qty.toString(), dataX + cellWidth, dataY);
      doc.text(product.price.toString(), dataX + 2 * cellWidth, dataY);
      dataY += cellHeight;
    });
    doc.text('__________________________________' + this.totalPrice, startX, startY);

    try {
      doc.save(this.businessAlias + this.generateFormattedCurrentDateTime());
    } catch (error) {
      this.notifyMessage = 'An error occurred while saving the PDF';
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
    }
  }

  generateVATAmount() {
    const totalAmount = this.totalPrice;
    const vatPercentage = this.vatRate;
    const vatAmount = (totalAmount * vatPercentage) / (100 + vatPercentage);
    this.vatSale = this.totalPrice - vatAmount;
    return vatAmount.toFixed(2)
  }

  generateFormattedCurrentDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');

    return year + month + day + hours + minutes;
  }

  generateProductOnReceipt() {
    for (const element of this.cartData) {
      let price = element.soldQuantity * element.srp;
      const newProductOnReceipt = {
        productName: element.productName,
        qty: element.soldQuantity,
        price: price
      };
      this.receiptProducts.push(newProductOnReceipt);
    }
    console.log(this.receiptProducts);
  }


}
