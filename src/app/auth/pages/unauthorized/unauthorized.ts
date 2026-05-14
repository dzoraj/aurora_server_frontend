import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css'
})
export class UnauthorizedComponent {
  protected readonly authEnabled = environment.authEnabled;
  private readonly oidc = inject(OidcSecurityService);

  tryAgain(): void {
    this.oidc.authorize();
  }
}
