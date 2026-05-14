import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-auth-toolbar',
  standalone: true,
  templateUrl: './auth-toolbar.html',
  styleUrl: './auth-toolbar.css'
})
export class AuthToolbarComponent {
  private readonly oidc = inject(OidcSecurityService);

  readonly displayName = toSignal(
    this.oidc.userData$.pipe(
      startWith(null),
      map((u) => {
        const d = u?.userData as Record<string, unknown> | undefined;
        if (!d) {
          return null;
        }
        return (
          (d['preferred_username'] as string) ||
          (d['name'] as string) ||
          (d['email'] as string) ||
          'Signed in'
        );
      })
    ),
    { initialValue: null as string | null }
  );

  login(): void {
    this.oidc.authorize();
  }

  logout(): void {
    this.oidc.logoff().subscribe();
  }
}
