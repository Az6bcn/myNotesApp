import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-free-trial',
  templateUrl: './free-trial.component.html',
  styleUrls: ['./free-trial.component.scss']
})
export class FreeTrialComponent implements OnInit {

  trialIframe: any;
  @ViewChild('frame', { static: true }) frameDiv!: ElementRef<HTMLDivElement>;
  constructor() { }

  ngOnInit() {
    this.trialIframe = environment.pabblySubscriptionPlans.businessIframe;
    this.frameDiv.nativeElement.innerHTML = this.trialIframe;
  }

}
