import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { AddProductDialogComponent } from './components/add-product-dialog/add-product-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
import { SaleDialogComponent } from './components/sale-dialog/sale-dialog.component';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { VersionDisplayComponent } from './components/version-display/version-display.component';
import { SaleComponent } from './components/sale/sale.component';
import { ReportComponent } from './components/report/report.component';
import { ProductComponent } from './components/product/product.component';
import { DeletePromptComponent } from './components/prompts/delete-prompt/delete-prompt.component';
import { NotifPromptComponent } from './components/prompts/notif-prompt/notif-prompt.component';
import { DeletePromptSaleComponent } from './components/delete-prompt-sale/delete-prompt-sale.component';
import { FooterComponent } from './components/footer/footer.component';
import { AddBatchProductComponent } from './components/add-batch-product/add-batch-product.component';
import { AddBatchProductsConfirmationPromptsComponent } from './components/prompts/add-batch-products-confirmation-prompts/add-batch-products-confirmation-prompts.component';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    AddProductDialogComponent,
    SaleDialogComponent,
    VersionDisplayComponent,
    SaleComponent,
    ReportComponent,
    ProductComponent,
    DeletePromptComponent,
    NotifPromptComponent,
    DeletePromptSaleComponent,
    FooterComponent,
    AddBatchProductComponent,
    AddBatchProductsConfirmationPromptsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatCheckboxModule,
    MatRadioModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
