import { Component, Inject, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private broadcastService: MsalBroadcastService, private _authService: MsalService) { }

  ngOnInit() {

    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        //this.setLoginDisplay();
      })

    window.addEventListener('DOMContentLoaded', event => {

      // Navbar shrink function
      var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
          return;
        }
        if (window.scrollY === 0) {
          navbarCollapsible.classList.remove('navbar-shrink')
        } else {
          navbarCollapsible.classList.add('navbar-shrink')
        }

      };

      // Shrink the navbar
      navbarShrink();

      // Shrink the navbar when page is scrolled
      document.addEventListener('scroll', navbarShrink);

      // Activate Bootstrap scrollspy on the main nav element
      const mainNav = document.body.querySelector('#mainNav');
      if (mainNav) {
        // new bootstrap.ScrollSpy(document.body, {
        //   target: '#mainNav',
        //   offset: 74,
        // });
      };

      // Collapse responsive navbar when toggler is visible
      const navbarToggler: any = document.body.querySelector('.navbar-toggler');
      const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
      );
      responsiveNavItems.map(function (responsiveNavItem: any) {
        responsiveNavItem.addEventListener('click', () => {
          if (window.getComputedStyle(navbarToggler).display !== 'none') {
            navbarToggler.click();
          }
        });
      });

    });

  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this._authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this._authService.loginRedirect();
    }
  }

  // login(): void {
  //   this._authService.loginPopup()
  //     .subscribe({
  //       next: (response) => {
  //         console.log('response', response)
  //       }, error: (error) => console.log(error)
  //     });
  // }
  // login() {
  //   if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
  //     if (this.msalGuardConfig.authRequest) {
  //       this._authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
  //         .subscribe((response: AuthenticationResult) => {
  //           this._authService.instance.setActiveAccount(response.account);
  //         });
  //     } else {
  //       this._authService.loginPopup()
  //         .subscribe((response: AuthenticationResult) => {
  //           this._authService.instance.setActiveAccount(response.account);
  //         });
  //     }
  //   } else {
  //     if (this.msalGuardConfig.authRequest) {
  //       this._authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
  //     } else {
  //       this._authService.loginRedirect();
  //     }
  //   }
  // }
}
