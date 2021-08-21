import { AuthService } from './../services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { SubscriptionPlanEnum } from '../enumerations/subscription-plan.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
  }

  signUp(): void {
    this._authService.login();
  }

  freeTrial(): void {
    this._authService.freeTrial(SubscriptionPlanEnum.business);
  }
}
