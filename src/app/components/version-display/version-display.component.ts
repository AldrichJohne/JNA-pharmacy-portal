import { Component, OnInit } from '@angular/core';
import {VersionDisplayService} from "../../services/version-display.service";

@Component({
  selector: 'app-version-display',
  templateUrl: './version-display.component.html',
  styleUrls: ['./version-display.component.scss']
})
export class VersionDisplayComponent implements OnInit {
  applicationVersion: string = '';

  constructor(
    private versionDisplayService: VersionDisplayService
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
            alert('Error connecting to M=icorservice');
        }
      }
    )
  }

}
