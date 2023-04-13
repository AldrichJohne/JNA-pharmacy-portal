import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from "moment";
import {SaleReportsService} from "../../services/sale-reports.service";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  dateRangeReportForm!: FormGroup;
  reportDateRangeValue: string = "MMM-DD-YYYY - MMM-DD-YYYY";
  reportGrossValue: string = "0.00";
  reportProfitValue: string = "0.00";
  brandedGross: string = "0.00";
  genericsGross: string = "0.00";
  galenicalsGross: string = "0.00";
  iceCreamGross: string = "0.00";
  othersGross: string = "0.00";
  brandedProfit: string = "0.00";
  genericsProfit: string = "0.00";
  galenicalsProfit: string = "0.00";
  iceCreamProfit: string = "0.00";
  othersProfit: string = "0.00";

  constructor(private reportService: SaleReportsService,
              private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.dateRangeReportForm = this.formBuilder.group({
      startDateTemp: ['',Validators.required],
      endDateTemp: ['',Validators.required]
    });
  }

  findReportRecord() {
    this.dateRangeReportForm.enable();
    const convertedStartDate = moment(this.dateRangeReportForm.value.startDateTemp).format('YYYY-MM-DD');
    const convertedEndDate = moment(this.dateRangeReportForm.value.endDateTemp).format('YYYY-MM-DD');
    this.reportService.getReportByDateRange(convertedStartDate, convertedEndDate).subscribe(
      {
        next:(res)=>{
          this.reportDateRangeValue = res.date;
          this.reportGrossValue = res.gross;
          this.reportProfitValue = res.profit;
          this.dateRangeReportForm.reset();
          this.setUpReport(res);
        },
        error:()=>{
          alert("Error while fetching reports by given date range: " + convertedStartDate + " to " + convertedEndDate);
        }
      }
    )
  }

  private setUpReport(res: any): void {
    const { breakdown } = res;
    const [
      { gross: brandedGross, profit: brandedProfit },
      { gross: genericsGross, profit: genericsProfit },
      { gross: galenicalsGross, profit: galenicalsProfit },
      { gross: iceCreamGross, profit: iceCreamProfit },
      { gross: othersGross, profit: othersProfit }
    ] = breakdown;

    this.brandedGross = brandedGross;
    this.genericsGross = genericsGross;
    this.galenicalsGross = galenicalsGross;
    this.iceCreamGross = iceCreamGross;
    this.othersGross = othersGross;
    this.brandedProfit = brandedProfit;
    this.genericsProfit = genericsProfit;
    this.galenicalsProfit = galenicalsProfit;
    this.iceCreamProfit = iceCreamProfit;
    this.othersProfit = othersProfit;
  }

  reportClearAllCards() {
    this.reportDateRangeValue = "MMM-DD-YYYY - MMM-DD-YYYY";
    this.reportGrossValue = "0.00";
    this.reportProfitValue = "0.00";
    this.brandedGross = "0.00";
    this.genericsGross = "0.00";
    this.galenicalsGross = "0.00";
    this.iceCreamGross = "0.00";
    this.othersGross = "0.00";
    this.brandedProfit = "0.00";
    this.genericsProfit = "0.00";
    this.galenicalsProfit = "0.00";
    this.iceCreamProfit = "0.00";
    this.othersProfit = "0.00";
  }

}
