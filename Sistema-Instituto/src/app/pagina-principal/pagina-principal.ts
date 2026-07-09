import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';


@Component({
      standalone: true,
  selector: 'pagina-principal',
  imports: [    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,FormsModule],
  templateUrl: './pagina-principal.html',
  styleUrl: './pagina-principal.css',
})
export class PaginaPrincipal {
  usuario: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ingresar() {
      const tipoUsuario = this.auth.validarLogin(
      this.usuario,
      this.password
    );

    if(tipoUsuario === 'alumno'){
      this.auth.login();
      this.router.navigate(['/PaginaUsuario'], {
        replaceUrl: true
      });
    }

    else if(tipoUsuario === 'admin'){
      this.auth.login();
      this.router.navigate(['/PaginaAdmin'], {
        replaceUrl: true
      });
    }
    else {
      alert('Usuario o contraseña incorrectos');
    }

  }
}
