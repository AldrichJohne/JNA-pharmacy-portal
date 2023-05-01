import { Component, OnInit } from '@angular/core';
import {SharedEventService} from "../../services/shared-event.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  uiVersion = '';

  constructor(public shareEventService: SharedEventService) { }

  ngOnInit(): void {
    this.uiVersion = this.shareEventService.getUiVersion();
  }

}
