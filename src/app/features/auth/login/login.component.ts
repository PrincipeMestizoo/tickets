import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading = false;
  serverError = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  get f() { return this.form.controls; }

  submit(): void {
    this.serverError = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.form.getRawValue();

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (res) => {
        this.loading = false;
        this.redirectByRole(res.user.role);
      },
      error: (err) => {
        this.loading = false;
        this.serverError = err?.error?.error?.message || 'Credenciales inválidas. Verifica tu correo y contraseña.';
      }
    });
  }

  private redirectByRole(role: string): void {
    // Todos los roles aterrizan en /dashboard; el propio dashboard
    // adapta su contenido según el rol del usuario autenticado.
    this.router.navigate(['/dashboard']);
  }
}
