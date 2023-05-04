import { Component, OnInit } from '@angular/core';
import {VersionDisplayService} from "../../services/version-display.service";
import {NotifPromptComponent} from "../prompts/notif-prompt/notif-prompt.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-version-display',
  templateUrl: './version-display.component.html',
  styleUrls: ['./version-display.component.scss']
})
export class VersionDisplayComponent implements OnInit {
  applicationVersion: string = '';
  notifyMessage = '';
  notifyStatus = '';

  constructor(
    private versionDisplayService: VersionDisplayService,
    private dialog : MatDialog
  ) { }

  ngOnInit(): void {
    this.healthCheck();
  }

  healthCheck() {
    this.versionDisplayService.healthCheck().subscribe(
      {
        next:(res)=>{
          this.applicationVersion = res.applicationVersion;
        },
        error:()=>{
            this.notifyMessage = 'Error connecting to Micorservice';
            this.notifyStatus = 'ERROR';
            this.OpenNotifyDialog();
        }
      }
    )
  }

  OpenNotifyDialog() {
    this.dialog.open(NotifPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

}
