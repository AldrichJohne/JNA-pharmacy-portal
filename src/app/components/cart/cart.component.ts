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
  dataSource = new MatTableDataSource(this.shareEventService.cartItems);
  totalPrice = 0;
  payment = 0;
  change = 0;
  notifyMessage = '';
  notifyStatus = '';
  businessName = 'JNA Pharmacy';
  businessAlias = 'JNAPh';
  businessAddress = 'Sinabaan, Bantay, Ilocos Sur';
  businessTIN = '000-111-2222';
  txnInvoice = '';
  vatRate = 12;
  vatSale: string = '';
  receiptProducts: any[] = [];
  productSavedVerified: Object = [];
  receiptButtonStatus = true;
  calcButtonStatus = false;


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

  removeProductFromList(row : any) {
    this.shareEventService.removeItemFromCart(row);
    this.dataSource = new MatTableDataSource(this.shareEventService.cartItems);
    this.shareEventService.refreshProductTab.next(true);
    this.totalPrice = this.shareEventService.cartTotalSrp;
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

      this.cashierService.batchProductSale(this.cartData)
        .subscribe({
          next:(res)=> {
            // @ts-ignore
            this.txnInvoice = res[0].invoiceCode;
            this.productSavedVerified = res;
            this.notifyMessage = 'Product Sell Success';
            this.notifyStatus = 'OK';
            this.openNotifyDialog();
            this.productsOnCart = res;
            this.shareEventService.removeItemsFromCart();
            this.cartForm.reset();
            this.receiptButtonStatus = false;
            this.calcButtonStatus = true;
            this.shareEventService.refreshProductTab.next(true);
          }, error: ()=> {
            this.notifyMessage = 'Error Saving Sale';
            this.notifyStatus = 'ERROR';
            this.openNotifyDialog();
          }
        })
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
    doc.text('Txn #:' + this.txnInvoice, startX, startY);
    startY += textSpacing;
    doc.text('________________________', startX, startY);

    //Product Table
    const headers = ["product", "qty", "price"];
    const tableTopMargin = startY + textSpacing;

    let tableX = startX;
    const tableY = tableTopMargin;
    const cellWidth = 30;
    const cellHeight = textSpacing;

    headers.forEach((header) => {
      doc.text(header, tableX, tableY);
      tableX += cellWidth;
    });

    const products = this.receiptProducts;

    let dataX = startX;
    let dataY = tableY + cellHeight;

    products.forEach((product) => {
      const productNameLines = doc.splitTextToSize(product.productName, cellWidth);
      for (let i = 0; i < productNameLines.length; i++) {
        doc.text(productNameLines[i], dataX, dataY + i * cellHeight);
      }
      doc.text(product.qty.toString(), dataX + cellWidth, dataY);
      doc.text(product.price.toFixed(2), dataX + 2 * cellWidth, dataY);
      dataY += cellHeight * Math.max(productNameLines.length, 1);
    });

    doc.text('________________________', startX, dataY);
    dataY += textSpacing;
    doc.text('VAT Amount('+this.vatRate+'%): ' + this.generateVATAmount(), startX, dataY);
    dataY += textSpacing;
    doc.text('(V)Vatable Sales: ' + this.vatSale, startX, dataY);
    dataY += textSpacing;
    dataY += textSpacing;
    doc.text('SUBTOTAL: ' + this.totalPrice, startX, dataY);
    dataY += textSpacing;
    doc.text('AMOUNT TENDERED: ' + this.payment, startX, dataY);
    dataY += textSpacing;
    doc.text('CHANGE: ' + this.change, startX, dataY);
    dataY += textSpacing;

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
    let unformattedVatSale = this.totalPrice - vatAmount;
    this.vatSale = unformattedVatSale.toFixed(2);
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
    // @ts-ignore
    for (const element of this.productSavedVerified) {
      let price = element.soldQuantity * element.srp;
      const newProductOnReceipt = {
        productName: element.productName,
        qty: element.soldQuantity,
        price: price
      };
      this.receiptProducts.push(newProductOnReceipt);
    }
  }

}
