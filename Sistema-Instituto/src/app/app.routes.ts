import { Routes } from '@angular/router';
import { PaginaPrincipal } from './pagina-principal/pagina-principal';
import { PaginaUsuario } from './pagina-usuario/pagina-usuario';
import { PaginaAdmin } from './pagina-admin/pagina-admin';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: PaginaPrincipal
    },
    {
        path: 'PaginaUsuario',
        component: PaginaUsuario,
        canActivate: [authGuard]
    },
    {
        path: 'PaginaAdmin',
        component: PaginaAdmin,
        canActivate: [authGuard]
    }
];
