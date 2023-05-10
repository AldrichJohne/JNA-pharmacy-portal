import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-notif-prompt',
  templateUrl: './notif-prompt.component.html',
  styleUrls: ['./notif-prompt.component.scss']
})
export class NotifPromptComponent implements OnInit {
  message : any;
  icon : any;

  constructor(@Inject(MAT_DIALOG_DATA) public notifData : any) { }

  ngOnInit(): void {
    this.message = this.notifData.notifyMessage;
    this.checkNotificationStatus();
  }

  checkNotificationStatus() {
    if (this.notifData.notifyStatus == 'OK') {
      this.icon = 'sentiment_very_satisfied';
    } else {
      this.icon = 'sentiment_very_dissatisfied';
    }
  }


}
