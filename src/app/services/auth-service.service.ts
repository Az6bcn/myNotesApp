import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AccountInfo, PopupRequest } from '@azure/msal-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SubscriptionPlanEnum } from '../enumerations/subscription-plan.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<any>(null);
  constructor(
    private _masalService: MsalService,
    private http: HttpClient,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private router: Router) { }
  login(): void {
    this._masalService.loginPopup({ ...this.msalGuardConfig.authRequest as PopupRequest })
      .subscribe({
        next: (response) => {
          console.log('response', response)
          this.processAccountInfo(response.account);
          this.callApiTest()
            .subscribe(res => console.log('Api res: ', res));
        }, error: (error) => console.log(error)
      });
  }

  logout(): void {
    this._masalService.logout({
      postLogoutRedirectUri: environment.azureAdB2cConfig.postLogoutRedirectUri
    });
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

          this.router.navigate(['trial']);

        }, error: (error) => console.log(error)
      });
  }


  callApiTest(): Observable<any> {
    return this.http.get('http://localhost:5000/WeatherForecast')
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred', error);
    return Observable.throw(error.message || error);
  }
}
