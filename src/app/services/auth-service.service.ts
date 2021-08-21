import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { SubscriptionPlanEnum } from '../enumerations/subscription-plan.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<any>(null);
  constructor(private _masalService: MsalService) { }
  login(): void {
    this._masalService.loginPopup()
      .subscribe({
        next: (response) => {
          console.log('response', response)
          this.processAccountInfo(response.account);
        }, error: (error) => console.log(error)
      });
  }

  logout(): void {
    this._masalService.logout();
  }

  private processAccountInfo(account: AccountInfo | null): void {
    if (account)
      this.setUser(account.name);
  }

  private setUser(user: any): void {
    localStorage.setItem('user', user);
  }

  unsetUser(): void {
    localStorage.removeItem('user');
    this.user$.next(null);
  }

  getUser$(): Observable<string> {
    this.user$.next(localStorage.getItem('user') as string);
    return this.user$.asObservable();
  }

  freeTrial(plan: SubscriptionPlanEnum) {
    this._masalService.loginPopup()
      .subscribe({
        next: (response) => {
          console.log('response', response)
          this.processAccountInfo(response.account);
          this.addSubscriptionPlanToUser(plan, response.uniqueId);
        }, error: (error) => console.log(error)
      });
  }

  addSubscriptionPlanToUser(subscriptionPlan: SubscriptionPlanEnum, userId: string) {
    console.log('addSubscriptionPlanToUser', subscriptionPlan, userId);
  }

}
