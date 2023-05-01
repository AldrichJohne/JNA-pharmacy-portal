import { Component, OnInit } from '@angular/core';
import { SharedEventService } from "./services/shared-event.service";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  pharmacistControl = new FormControl('');
  pharmacist = '';

  constructor(public shareEventService: SharedEventService) {
  }
  ngOnInit(): void {
    this.pharmacistControl.valueChanges.subscribe((value : string) => {
      if (value == 'Nova') {
        this.pharmacist = 'Nova';
      } else if (value == 'Jas') {
        this.pharmacist = 'Jas'
      } else {
        this.pharmacist = ''
      }
      this.shareEventService.updatePharmacist(this.pharmacist);
    })
  }



}
